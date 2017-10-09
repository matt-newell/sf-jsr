import { Component, Prop, EventEmitter, Event } from '@stencil/core';

declare global {
    interface Window { Visualforce: any; }
}

declare global {
    interface Window { configSettings: any; }
}

@Component({
  tag: 'st-jsr'
})
export class StFetch {

  @Prop() headers     : object;
  @Prop() method      : any;
  @Prop() args        : any; //NOTE: not implemented yet
  @Prop() escape      : any; //NOTE: not implemented yet
  @Prop() buffer      : any; //NOTE: not implemented yet
  @Prop() timeout     : any;
  @Prop() buttonLabel : string = 'Fetch';

  @Event() fetchResolved : EventEmitter;
  @Event() fetchError    : EventEmitter;

  invokeStaticAction() {
    let lastArg = arguments[arguments.length - 1],
        callback = lastArg,
        mock = self.configSettings.mocks[arguments[0]],
        //mock = $mocks[arguments[0]] || genericMock,
        result = mock.method(arguments),
        event = {
            status: true,
            message: null
        };

    if (mock.error){
        event.status = false;
        event.message = mock.error;
    }

    if (typeof (callback) === 'object') {
        callback = arguments[arguments.length - 2];
    }

    setTimeout( () => {
        callback(result, event);
    }, mock.timeout);
  }

  jsr() {
    let jsr = new Promise((resolve, reject) => {
      let parameters = [this.method];
      let callback = (result, event) => {
        if (event.status){
          resolve(result);
        }else {
          reject(event);
        }
      }
      //NOTE: need to add dynamic parameters from call
      parameters.push(callback);
      //push options to remote
      parameters.push({buffer: this.buffer, escape: this.escape, timeout: this.timeout});
      self.Visualforce.remoting.Manager.invokeAction.apply(self.Visualforce.remoting.Manager, parameters);
    });

    return jsr;
  }

  doJsr () {
    let options = {
      method: this.method,
      headers: this.headers,
      args: this.args,
      buffer: this.buffer,
      escape: this.escape,
      timeout: this.timeout
    };

    self.Visualforce = self.Visualforce || {remoting: {Manager:{invokeAction: this.invokeStaticAction}}};

    if(self.Visualforce) {
      let method = this.method, //required
      args = [],  //only required if function expects arguments
      options = {buffer: this.buffer, escape: this.escape, timeout: this.timeout} //optional

      this.jsr()
      .then( (result) => {
        this.fetchResolved.emit(result);
      })
      .catch( (error) => {
        this.fetchError.emit(error);
      });
    }

  }

  render() {
    return (
      <div>
        <button onClick={() => this.doJsr()}>
          <span>{this.buttonLabel}</span>
        </button>
      </div>
    );
  }
}
