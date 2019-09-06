# sp-utility-hooks
 
*sp-utility-hooks* is hooks and helpers collection wrapping around spscript-b library that allows for easier work with Sharepoint REST API and managing data from lists and libriaries.

Feel free to open issues and give feedback :)

## Installation

```sh
$ npm install sp-utility-hooks
```

## About React and Sharepoint

### Proxy your development
For your sanity please use *sp-rest-proxy* package when developing solutions in Sharepoint, it allows you to proxy all
your request and authenticate you with your Sharepoint site, this way you can work and test on real environment, which speeds up development dramatically when using React and NodeJS server. 

### How i use React components
All my solutions are injected using ContentEditor Webpart with path pointed to bundled index.html in SiteAssets folder.
It works pretty good, sometimes it messes with css there and there, but what can we do :)

I would love to develop my app using Sharepoint Framework, but on On-Premise versions of Sharepoint, SPFX doesn't support newest React versions which makes it useless for me (no hooks support)

---

## Data/Fetch Hooks:

In most hooks you need  to provide `ctx` property in config object.

`ctx` sharepoint context (if your page is on *http://my-spsite/site/supersite1/page1.aspx* you need to provide **'http://my-spsite/site/supersite1/'** as your ctx url. 

If you're using **sp-rest-proxy** and in development mode provide **" "** )

### **`useSPPeopleFetch()`** 
search people in SP Site with query passed in search function

```js
const [people, search] = useSPPeopleFetch({
 ctx: 'http://mycoolspsite/mysite/'
})

//use search function somewhere
search('Beniamin')

//do something with data
people.data.map(person => console.log(person))

```

### **`useSPListSearch`**
search data in sharepoint list

```js
const [data, search] = useSPListSearch({
 ctx: 'http://mycoolspsite/mysite/' // | required
 listName: 'CoolList' // list name | required
 fieldName: 'Title' // searched field (you can override it later) | required
 searchType: 'substring' // you can choose between substring, exactString and number | required
 searchCondition: '-eq' // you can provide all SP REST filters conditions, if empty defaults to -eq 
 selectFields: 'SomeNotCommonField' // you can select additional fields that are not returned with * in filter (like File etc.)
 expandFields: 'File/Name' // you can expand fields
 top: 500 // amount of records 
 order: 'asc' // you can use SP orders
 odata: '&$filter=Name -eq 'Monika'' // you can inject additional odata
 initSearch: true // set true if you want to pre-search data on component mount
 initSearchQuery: 'Super Element' // query for initial search, only used if initSearch is true
})

// if initialSarch is set to true
// all your records are here after loading is finished
!data.isLoading && console.log(data.data) 

// if you want search manualy, on input etc.
search('yourInputValue','SomeFieldNotInConfig')
.then(response => console.log(response)

```

### **`useSPDictionaryFetch()`** 
fetches SP Choice field options 

```js
const [dictionary, fetchDictionary] = useSPDictionaryFetch({
 ctx: 'http://mycoolspsite/mysite/' // as always | required
 fields: ['Status','Type'] // fields of Choice type in SP you want to fetch options from
 listName: 'SuperList' // SP List name
})

//you can access your dictionaries after fetch 
//any fields provided in fields propery are mapped to dictionary object with all choices that are in field
console.log(dictionary['Status'])

//you can refetch dictionaries, its pretty useless right now because you cannot override anything
fetchDictionary()

```

### **`useExcelExport()`** 
exporting array of objects to excel with remaping names of properties (for column names)

```js
const [save, data] = useExcelExport({
 data: myArray // array of objects you want to export
 model: myModel // model used for remaping and changing properties on fly
 onBeforeExport: doSomethingWithData(data => return data.map(val => val.count+1)) // do something with data before export
 onBeforeParse: doSomethingWithData(data) // do something with data before parsing with model
})

//export on click
<Button onClick={() => save('filename')}>

```

example model used for export, properites not in model are not exported !
```js
 export const exampleModel = [
  {old: "property1", new:"Super property 1", render: (value) => value ? 'SUPER YES' : 'SUPER NO'}, //remaps old name to new name and change field value conditionaly with render callback
  {old: "property2", new:"Super property 2"},
];
```

## User/Security 

### **`SecurityProvider`**
provides current user object and permission model

```js
import {aclModel,config} from './config';
//app.js

<SecurityProvider 
 aclModel={aclModel}
 ctx={config.contextUrl} // your SP site url
>
 //components you want to secure 
 //you can put router here and use can() function to check if user should get access to some pages etc...
</SecurityProvider>

```

example aclModel
```js
const aclModel = [
    {
      action: "post",
      permissions: [
        {
          can: "write", //you can name your ability as you wish
          who: "[Bloggers, Administrators"] //Sharepoint group that youre checking against, if user is in one of those, he will
                                            //be able to use "write" ability
        },
        {
          can: "read",
          who: ["Everyone"]
        }
      ]
    }
  ];

```
### **`usePermissionCheck()`**

```js
const {can} = usePermissionCheck(); // get user object and aclModel from SecurityContext

if(can('post','write)){
 showAddPostModal()
}else{
 alert('Ha! You can't !')
}

```


 
