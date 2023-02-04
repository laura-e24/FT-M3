'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

// <----- VERSIÓN FUNCIÓN -----> //

// const $Promise = function(executor) {
//    if (!executor || typeof executor !== 'function') {
//       throw TypeError(/executor.+function/i);
//    }
//    this._state = 'pending';
//    this._handlerGroups = [{successCb: () => {}, errorCb: () => {}}]
//    executor((value) => this._internalResolve(value), (reason) => this._internalReject(reason))
// }

// $Promise.prototype._internalResolve = function(value) {
//    if (this._state === 'pending') {
//       this._value = value;
//       this._state = 'fulfilled'
//    }
// }
// $Promise.prototype._internalReject = function(reason) {
//    if (this._state === 'pending') {
//       this._value = reason;
//       this._state = 'rejected'
//    }
// }

// $Promise.prototype.then = function(onfulfilled, onreject) {
//       if (typeof onfulfilled === 'function' && typeof onreject === 'function')  {
//          this._handlerGroups.push({successCb: onfulfilled, errorCb: onreject})
//       } else  this._handlerGroups.push({successCb: false, errorCb: false})
//    }   

// <----- VERSIÓN CLASE -----> //
class $Promise {
   constructor(executor) {
      if (!executor || typeof executor !== 'function') throw TypeError(/executor.+function/i);
      
      this._state = 'pending';
      this._value = undefined;
      this.executor = executor;
      this._handlerGroups = [];
      
      this.executor((value) => this._internalResolve(value), (reason) => this._internalReject(reason))
   }

   _internalResolve(value) {
      if (this._state === 'pending') {
         this._value = value;
         this._state = 'fulfilled'
      }
      this._callHandlers()
   }

   _internalReject(reason) {
      if (this._state === 'pending') {
         this._value = reason;
         this._state = 'rejected'
      }
      this._callHandlers()
   }

   _callHandlers() {
      while (this._handlerGroups.length) {
         const currentHandler = this._handlerGroups.shift();
         if (this._state === 'fulfilled' && currentHandler.successCb)
            currentHandler.successCb(this._value)
         
         if (this._state === 'rejected' && currentHandler.errorCb)
            currentHandler.errorCb(this._value)
      }
   }

   _resolver(value) {
      this._value = value;
      this._state = 'fulfilled'
   }

   then(onfulfilled, onreject) {
      const that = this;
      const handlerGroup = {
         successCb: typeof onfulfilled === 'function' ? onfulfilled : false,
         errorCb: typeof onreject === 'function' ? onreject : false,
         downstreamPromise: new $Promise((resolve, reject) => {
            if (!onfulfilled || !onreject) this._callHandlers()
            if (that._state === 'fulfilled')  resolve(that._value)
            if (that._state === 'rejected')  reject(that._value)
         })
      }
      this._handlerGroups.push(handlerGroup)
      if  (this._state !== 'pending') this._callHandlers()
      return handlerGroup.downstreamPromise
   }   

   catch(onreject) {
      return this.then(null, onreject)
   }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
