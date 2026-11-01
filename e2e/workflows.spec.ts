import {test,expect} from '@playwright/test'

test.beforeEach(async({page})=>{await page.goto('/')})

test('landing page has a clear create flow without losing input focus',async({page})=>{
 await expect(page.getByRole('heading',{name:/Think freely/})).toBeVisible()
 await page.getByRole('button',{name:'Create a fortress'}).click()
 const dialog=page.getByRole('dialog',{name:'Create a knowledge fortress'})
 const field=dialog.getByRole('textbox',{name:'Fortress name'})
 await field.pressSequentially('My Memory Fortress',{delay:35})
 await expect(field).toHaveValue('My Memory Fortress')
 await expect(field).toBeFocused()
 await dialog.getByRole('button',{name:'Create fortress'}).click()
 await expect(page.getByTestId('native-excalidraw-editor')).toBeVisible()
 await expect(page.getByText('My Memory Fortress').first()).toBeVisible()
})

test('Excalidraw native editor opens for a saved fortress and shows memory tools',async({page})=>{
 await page.getByRole('button',{name:/Operating Systems.*Open canvas/}).click()
 await expect(page.getByTestId('native-excalidraw-editor')).toBeVisible()
 await expect(page.locator('.excalidraw')).toBeVisible()
 await expect(page.getByText('Make the drawing memorable.')).toBeVisible()
 await expect(page.getByRole('button',{name:'Export scene'})).toBeVisible()
})

test('returning to the library and re-opening the editor works',async({page})=>{
 await page.getByRole('button',{name:/Operating Systems.*Open canvas/}).click()
 await page.getByRole('button',{name:'Back to fortresses'}).click()
 await expect(page.getByRole('heading',{name:'Fortresses'})).toBeVisible()
 await page.getByRole('button',{name:/Operating Systems.*Open canvas/}).click()
 await expect(page.getByTestId('native-excalidraw-editor')).toBeVisible()
})

test('legacy memories are available in recall mode',async({page})=>{
 await page.getByRole('button',{name:/Operating Systems.*Open canvas/}).click()
 await page.getByRole('button',{name:'Recall',exact:true}).click()
 await expect(page.getByText('What do threads share and what stays private?')).toBeVisible()
 await page.getByRole('button',{name:'Reveal memory'}).click()
 await expect(page.getByText(/four chefs use the same refrigerator/i)).toBeVisible()
 await page.getByRole('button',{name:'Remembered'}).click()
 await expect(page.getByText('How do concurrency and parallelism differ?')).toBeVisible()
})

test('a created fortress persists when the page reloads',async({page})=>{
 await page.getByRole('button',{name:'Create a fortress'}).click()
 await page.getByRole('textbox',{name:'Fortress name'}).fill('Persistent Palace')
 await page.getByRole('dialog',{name:'Create a knowledge fortress'}).getByRole('button',{name:'Create fortress'}).click()
 await page.getByRole('button',{name:'Back to fortresses'}).click()
 await page.reload()
 await expect(page.getByText('Persistent Palace')).toBeVisible()
})

test('Mindfort dotmark replaces icon-based branding in navigation and editor',async({page})=>{
 await expect(page.getByRole('button',{name:/mindfort/i}).first().locator('svg circle')).toHaveCount(6)
 await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href','./favicon.svg')
 await page.getByRole('button',{name:/Operating Systems.*Open canvas/}).click()
 await expect(page.getByTestId('native-excalidraw-editor')).toBeVisible()
 await expect(page.getByText('Turn drawings into memories.')).toBeVisible()
})

test('study guide and privacy policy are discoverable from home page',async({page})=>{
 await expect(page.getByRole('link',{name:'How to build a memory palace'})).toHaveAttribute('href','./memory-palace-guide.html')
 await expect(page.getByRole('link',{name:'Privacy policy'})).toHaveAttribute('href','./privacy.html')
})
