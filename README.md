# sp-utility-hooks

Hello ! sp-utility-hooks is hooks and helpers collection wrapping around spscript-b library that allows for easier work with Sharepoint REST API and managing data from lists.

## ! Documentation is WIP !

### Hooks:

In most hooks you need  to provide ctx property in config object.
 -- `ctx` sharepoint context (if your page is on *http://my-spsite/site/supersite1/page1.aspx* you need to provide **'http://my-spsite/site/supersite1/'** as your ctx url. If you're using **sp-rest-proxy** provide **" "** )

### **`[people, search] = useSPPeopleFetch(config)`** - search people in SP Site with query passed in search function
**returns** 
 -- `people` object with data and fetch status `people.data` `people.isLoading` `people.isError` 
 -- `search(query)` fetching people by name with provided `query`

### **`[people, search] = useSPListSearch(config)`** - search for data in lists with query passed in search function.
**returns** 
 -- `data` object with data and fetch status `data.data` `data.isLoading` `data.isError` 
 -- `search(query, overrideField)` fetching people by name with  `query` and if provided `overrideField` changes `searchField` from config.
 **config**
 -- `ctx` as always
 -- `listName` title of list you want to search in
 -- `fieldName` internal name of field that you want to search against
 -- `searchType` how you want to search in field (number, exactString, substring, listAll)
 -- `selectFields` what fields you want to select (default is always * + `selectFields` if provided)
 -- `expandFields` what fields you want to expand
 -- `top` number of items you want to return
 -- `order` order type (asc | desc), defaults to asc
 -- `odata` additional odata (filter)
 -- `initSearch` set `true` if you want to fetch data on component mount with `initialSearchQuery` if provided
 -- `initSearchQuery` provide query for initial search, if empty list all items on initial search
 
 
