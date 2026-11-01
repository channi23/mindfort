import test from 'node:test'
import assert from 'node:assert/strict'
import { GRID, demo, fresh, roomAt, validRoom, validItemLocation, isPalace } from '../src/model.ts'

test('demo is a structurally valid fortress',()=>{const p=demo();assert.equal(isPalace(p),true);assert.equal(p.rooms.length,4);assert.equal(p.items.length,5);assert.equal(p.items.every(i=>roomAt(p,i.x,i.y)),true)})
test('rooms cannot overlap existing rooms',()=>{const p=demo();const r={id:'new',name:'Overlapping',x:3,y:3,w:4,h:4,color:'#fff'};assert.equal(validRoom(p,r),false)})
test('rooms must fit grid and be at least two cells',()=>{const p=fresh('test');const base={id:'a',name:'Room',color:'#fff'};assert.equal(validRoom(p,{...base,x:0,y:0,w:2,h:2}),true);assert.equal(validRoom(p,{...base,x:0,y:0,w:1,h:2}),false);assert.equal(validRoom(p,{...base,x:GRID.cols-1,y:0,w:2,h:2}),false)})
test('item placements must be inside rooms and unoccupied',()=>{const p=demo();assert.equal(validItemLocation(p,4,4),false);assert.equal(validItemLocation(p,4,4,p.items.find(i=>i.x===4&&i.y===4).id),true);assert.equal(validItemLocation(p,0,0),false);assert.equal(validItemLocation(p,8,7),true)})
test('invalid data is rejected',()=>{assert.equal(isPalace({}),false);assert.equal(isPalace({...demo(),items:[{kind:'malicious'}]}),false)})
