# stencil-jsr
Javascript Remoting implementation of Salesforce with Stencil

WIP

example usage

```
<st-jsr method="{!$RemoteAction.MyCustomController.myFunction}"/>

@Listen('fetchResolved')
fetchResolvedHandler(data) {
    console.log('Received from st-jsr: ', data);
}
```

# Getting Started

`npm install`

Running the Dev server
`npm start`
