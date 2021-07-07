---
title: TypeScript实用工具类型
date: 2021-05-11 15:22:09
tags: 
  - TypeScript
categories: 
  - 前端杂烩
---

TypeScript当中有一些内置的类型，适用于编译过程

<!-- more -->
### Partial\<Type\>
将Type的所有属性都设置为可选的，表示输入类型的所有子类型
```typescript
interface Person {
  name: string
  code: number
}

function show1(person: Partial<Person>) {
  console.log(person)
}

function show2(person: Person) {
  console.log(person)
}

show1({name: 'sookie'})
show2({name: 'sookie'}) // ERROR: Argument of type '{ name: string; }' is not assignable to parameter of type 'Person'.
```

### Readonly\<Type\>
将Type的所有属性都设置为`readonly`

```typescript
interface Person {
  name: string
  code: number
}

const person: Readonly<Person> = {
  name: 'sookie',
  code: 1
}

person.code = 2 // ERROR: Cannot assign to 'code' because it is a read-only property.
```

### Record\<Keys, Type\>
用来将某个类型的属性映射到另一个类型上
```typescript
interface PageInfo {
  title: string
}
// 必须满足 string | number | symbol
type Page = 'home' | 'about' | 'contact'

const item: Record<Page, PageInfo> = {
  about: { title: 'about' },
  contact: { title: 'contact' },
  home: { title: 'home' },
}
```

### Pick\<Type, Keys\>
从类型Type中挑选部分属性Keys来构造类型
```typescript
interface Person {
  name: string
  age: number
  remark: string
}
// 这里的第二个泛型值必须是属于 keyof Person
type PersonPick = Pick<Person, 'name' | 'age'>

const p: PersonPick = {
  name: 'sookie',
  age: 10
}
```

### Omit\<Type, Keys\>
与Pick用法类似，作用是相反的，用于从中剔除若干个key
```typescript
interface Person {
  name: string
  age: number
  remark: string
}
type PersonOmit = Omit<Person, 'remark' >

const p: PersonOmit = {
  name: 'sookie',
  age: 10
}
```