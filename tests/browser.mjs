import {chromium} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
import {join,normalize,extname} from 'node:path';

const root=join(process.cwd(),'out');
const origin='https://preview.velvet-frame.invalid';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2'};
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const browser=await chromium.launch({headless:true});
await mkdir('public/screenshots',{recursive:true});
try{
  for(const [name,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
    const context=await browser.newContext({viewport,deviceScaleFactor:1});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.origin!==origin){await route.abort();return;}
      let path=decodeURIComponent(url.pathname);
      if(path.endsWith('/'))path+='index.html';
      const target=normalize(join(root,path));
      if(!target.startsWith(root)){await route.fulfill({status:403,body:'Forbidden'});return;}
      try{const body=await readFile(target);await route.fulfill({status:200,contentType:mime[extname(target)]||'application/octet-stream',body});}
      catch{await route.fulfill({status:404,body:'Not found'});}
    });
    const response=await page.goto(origin+'/',{waitUntil:'networkidle'});
    assert(response?.status()===200,`${name}: production HTML`);
    assert(await page.getByRole('heading',{name:/A little more wonder/i}).isVisible(),`${name}: hero`);
    assert(await page.locator('.film-art').count()>=6,`${name}: original poster art`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${name}: horizontal overflow`);
    await page.screenshot({path:`public/screenshots/${name}.png`,fullPage:true});
    for(const [label,target] of [['Films','#programme'],['Showtimes','#showtimes'],['The cinema','#visit']]){
      await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:label}).click();
      assert(new URL(page.url()).hash===target,`${name}: ${label} anchor`);
    }
    await page.getByRole('button',{name:'Drama',exact:true}).click();
    assert(await page.locator('.film-card').count()===2,`${name}: genre filter`);
    await page.getByRole('button',{name:'All films'}).click();
    const search=page.getByRole('searchbox',{name:'Search films'});
    await search.fill('no matching film');
    assert(await page.getByRole('heading',{name:'No films found'}).isVisible(),`${name}: empty search`);
    assert(await page.getByText('No screenings match this selection.').isVisible(),`${name}: empty showtimes`);
    await page.getByRole('button',{name:'Show all films'}).click();
    assert(await page.locator('.film-card').count()===6,`${name}: clear search`);
    await search.fill('Mina Cho');
    assert(await page.locator('.film-card').count()===1,`${name}: director search`);
    await search.fill('');
    await page.getByRole('button',{name:'Explore The Stillwater Hour'}).click();
    assert(await page.getByRole('dialog',{name:'The Stillwater Hour'}).isVisible(),`${name}: film detail`);
    await page.keyboard.press('Escape');
    assert(await page.getByRole('dialog',{name:'The Stillwater Hour'}).count()===0,`${name}: Escape detail`);
    await page.locator('.date-pill').nth(1).click();
    assert(await page.locator('.date-pill').nth(1).getAttribute('aria-pressed')==='true',`${name}: date selection`);
    await page.locator('.date-pill').first().click();
    await page.locator('.screening-row').first().getByRole('button',{name:/Choose seats/}).click();
    const dialog=page.getByRole('dialog',{name:/The Stillwater Hour|Afterlight|Paper Birds|The Tideline Project|Blue Hour Letters|Night Swim Club/});
    assert(await dialog.isVisible(),`${name}: seat dialog`);
    if(name==='mobile'){const box=await dialog.locator('button.seat:not([disabled])').first().boundingBox();assert(box&&box.width>=40&&box.height>=40,`${name}: seat touch target`);}
    const occupied=dialog.locator('.seat--occupied').first();assert(await occupied.isDisabled(),`${name}: taken seat disabled`);
    await dialog.locator('button.seat:not([disabled])').first().click();
    assert(await dialog.getByText('1 seat', {exact:false}).count()>0,`${name}: seat chosen`);
    await dialog.getByRole('button',{name:/Continue with 1 seat/}).click();
    await dialog.getByRole('button',{name:/Create preview/}).click();
    assert(await dialog.getByRole('alert').isVisible(),`${name}: name validation`);
    await dialog.getByPlaceholder('Your name').fill('Alex Rivera');
    await dialog.getByPlaceholder('you@example.com').fill('invalid');
    await dialog.getByRole('button',{name:/Create preview/}).click();
    assert((await dialog.getByRole('alert').textContent()).includes('valid email'),`${name}: email validation`);
    await dialog.getByPlaceholder('you@example.com').fill('alex@example.com');
    await dialog.getByRole('button',{name:/Create preview/}).click();
    assert(await dialog.getByText(/A lovely plan, Alex/).isVisible(),`${name}: preview confirmation`);
    await dialog.getByRole('button',{name:'Back to the programme'}).click();
    await page.getByRole('button',{name:/My plans/}).click();
    const plans=page.getByRole('dialog',{name:/Evenings in the making/});
    assert(await plans.locator('.plan-card').count()===1,`${name}: saved plan`);
    await page.reload({waitUntil:'networkidle'});
    await page.getByRole('button',{name:/My plans/}).click();
    const restored=page.getByRole('dialog',{name:/Evenings in the making/});
    assert(await restored.locator('.plan-card').count()===1,`${name}: persistence`);
    await restored.getByRole('button',{name:'Remove preview'}).click();
    assert(await restored.getByRole('heading',{name:'No evenings planned yet'}).isVisible(),`${name}: removal and empty state`);
    await page.keyboard.press('Escape');
    assert(await restored.count()===0,`${name}: Escape plans`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${name}: final overflow`);
    assert(errors.length===0,`${name}: JavaScript errors ${errors.join('; ')}`);
    await context.close();
  }
  console.log('PASS desktop/mobile: rendering, anchors, genre/date/search, empty states, film detail, seat inventory, validation, preview, local persistence, removal, keyboard Escape and overflow');
}finally{await browser.close();}
