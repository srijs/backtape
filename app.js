function Stepper(doms) {
  var counter = 0;
  return function step () {
    var steps = arguments, dom, fn;
    if (counter < steps.length) {
      dom = doms[counter];
      fn = steps[counter];
      if (typeof fn === 'function') {
        console.log('FUN');
        dom.style.display = 'block';
        dom.className = 'processing';
        var next = function (c, msg) {
          dom.className = c;
          dom.innerHTML = msg;
          counter++;
          if (c !== 'error') step.apply(null, steps);
        };
        fn(function (msg) { next('ready', msg); },
           function (msg) { next('error', msg); });
      }
    }
  };
}

Doctape({
  appType: 'client',
  appId: '7b1fe099-b090-4ee2-996b-f83e56aee70f',
  callbackURL: 'http://localhost:5432/',
  scope: ['file.read', 'account']
}).run(function () {
  var dt = this,
      remoteDocs = null,
      newDocs = null;
  Stepper(document.querySelectorAll('#steps div'))(
    function (done, error) {
      dt.getAccount(null, function (err, account) {
        if (err) { return error('Could not connect to doctape.'); }
        document.getElementById('headline').innerHTML += ' ~' + account.username;
        done('Connected and logged in.');
      });
    },
    function (done, error) {
      dt.getDocumentList(null, function (err, docs) {
        if (err) { return error('Could not read remote documents.'); }
        remoteDocs = docs;
        done('Read <b>'+ Object.keys(docs).length +' remote</b> documents.');
      });
    },
    function (done, error) {
      var diffReq = new XMLHttpRequest();
      diffReq.open('POST', '/diff');
      diffReq.setRequestHeader('Content-Type', 'application/json');
      diffReq.send(JSON.stringify(remoteDocs));
      diffReq.addEventListener('error', function (ev) {
        error('Error comparing documents.');
      }, false);
      diffReq.addEventListener('load', function (ev) {
        newDocs = JSON.parse(ev.target.responseText);
        done('Found <b>'+ Object.keys(newDocs).length +' new</b> documents.');
      }, false);
    },
    function (done, error) {
      var syncReq = new XMLHttpRequest();
      syncReq.open('POST', '/sync?token=' + dt.core.getValidAccessToken());
      syncReq.setRequestHeader('Content-Type', 'application/json');
      syncReq.send(JSON.stringify(newDocs));
      syncReq.addEventListener('error', function (ev) {
        error('Error syncing documents.');
      }, false);
      syncReq.addEventListener('load', function (ev) {
        done('Synced documents.');
      }, false);
    }
  );
});
