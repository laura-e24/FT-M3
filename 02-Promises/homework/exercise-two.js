'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  let one = promisifiedReadFile('poem-two/stanza-01.txt').then(stanza1 => blue(stanza1))
  let two = promisifiedReadFile('poem-two/stanza-02.txt').then(stanza2 => blue(stanza2))

  Promise.all([one, two])
  .then(()=> console.log('done'))
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

 

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  // promise version
  //OPCION 1
  // var promise = filenames.map(file => promisifiedReadFile(file))
  // Promise.all(promise)
  // .then(stanza => {
  //   stanza.forEach(stanza => blue(stanza))
  //   console.log('done')
  // })

  //OPCION 2
  const promises = filenames.map(file => 
    promisifiedReadFile(file)
    .then(stz => blue(stz)))
    // [promesa1, promesa2, etc]

  Promise.all(promises)
  .then(() =>{
    console.log('done')
  })
}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );
  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  // [1, 2, 3, 4, 5, 6, 7, 8]
  //     i
  //  p
  //p = newPromise
  // promise version
  //OPCION 1
  // for (let i = 1, newPromise = promisifiedReadFile(filenames[0]); i <= filenames.length; i++) {
  //   //reasignamos su valor,para que cuando vuelva a ingresar al for, no siga leyendo el mismo archivo
  //   newPromise = newPromise.then(stanza => {
  //     blue(stanza)
  //     //Tenemos que vañidar si es el ultimo
  //     if(i === filenames.length){
  //       console.log('done')
  //     }
  //     //Si no es el ultimo, tenemos que leer el proximo
  //     else {
  //       return promisifiedReadFile(filenames[i])
  //     }
  //   })
    
  // }

  //OPCION2
  filenames.reduce((p, file) => {
    return p.then((stanza) => {
      if(stanza) blue(stanza)
      return promisifiedReadFile(file)
    })
  }, Promise.resolve(false))
  .then(stanza => {
    blue(stanza)
    console.log('done')
  })
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(new Error(err));
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  for (let i = 1, newPromise = promisifiedReadFile(filenames[0]); i <= filenames.length ; i++) {
    newPromise = newPromise.then(stanza => {
      blue(stanza)
      //validar si es el ultimo archivo
      if(i === filenames.length){
        console.log('done')
      }
      //si no es el ultimo, leer el proximo
      else {
        return promisifiedReadFile(filenames[i])
      }
    })
    if(i === filenames.length) {
      newPromise.catch(err => {
        magenta(new Error(err))
        console.log('done')
      })
  }
}
  //OPCION 2
  //SI FUERA EN PARALELO, USAMOS EL METODO ALL
  // const promesas = filenames.map((file)=> promisifiedReadFile(file))

  // Promise.all(promesas)
  // .then((stanzas) => {
  //   stanzas.forEach((stanza)=> blue(stanza));
  //   console.log("done");
  // })
  // .catch((err)=> {
  //   magenta(new Error(err))
  //   console.log("done")})


}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // tu código aquí
    return new Promise(function(reject, resolve){
      fs.writeFile(filename, str, err => {
        if(err) return reject(err)
        resolve('Va bien la cosa', str)
      })
    })
  }
}
