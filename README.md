# sp-utility-hooks

Hello ! sp-utility-hooks is hooks and helpers collection wrapping around spscript-b library that allows for easier work with Sharepoint REST API and managing data from lists.

## ! Documentation is WIP !

---

## Hooks:

In most hooks you need  to provide ctx property in config object.
-  `ctx` sharepoint context (if your page is on *http://my-spsite/site/supersite1/page1.aspx* you need to provide **'http://my-spsite/site/supersite1/'** as your ctx url. If you're using **sp-rest-proxy** provide **" "** )

### **`useSPPeopleFetch()`** 
search people in SP Site with query passed in search function

```js
[people, search] = usePeopleFetch({
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
[data, search] = useSPListSearch({
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


 
