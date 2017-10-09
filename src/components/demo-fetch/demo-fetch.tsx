import { Component, State, Listen } from '@stencil/core';


@Component({
    tag: 'demo-fetch'
})
export class DemoFetch {

    @State() method  : string = '{!$RemoteAction.MyCustomController.myFunction}';

    @Listen('fetchResolved')
    fetchResolvedHandler(data) {
        console.log('Received from st-jsr: ', data);
    }

    @Listen('fetchError')
    fetchErrorHandler(data) {
        console.log('Received from st-jsr: ', data);
    }

    render() {
        return (
            <div>
                <st-jsr method={this.method}/>
            </div>
        );
    }
}
