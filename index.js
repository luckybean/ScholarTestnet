/**
 * @author yahuang.wu
 * @date : 2018.03.19
 * @desc : generate and refresh block producer data
 */

var ScholarTest = {
  init: function () {

    document.getElementById('configuredProducer').innerText = window.producerList.length.toString();

    this.generateProducerTable();
    this.updateData();
  },
  // load 21 BP's info from producer.js, then generate the BP HTML table.
  generateProducerTable: function () {
    var producerList = window.producerList;
    var BPTable = document.getElementById('BPTable');
    for (var i = 0; i < producerList.length; i++) {
      var html = '<tr class="item">' +
        '<th><div class="producer-logo">' +
        '<img src="' + producerList[i].logo + '"/>' +
        '</div><span>' + producerList[i].name + '</span></th>' +
        '<th>' + producerList[i].name + '</th>' +
        '<th>' + producerList[i].contact + '</th>' +
        '<th class="item-last-block"></th>' +
        '<th>' + producerList[i].URL + '</th>' +
        '<th>' + producerList[i].HTTP + '</th>' +
        '<th>' + producerList[i].P2P + '</th>' +
        '<th class="item-time"></th>';

      var tr = document.createElement("tr");
      tr.class = 'item';
      tr.id = producerList[i].id;
      tr.innerHTML = html;
      BPTable.appendChild(tr);
    }
  },
  // update every BP's Last irreversible block and Number of blocks dynamically
  updateData: function () {
    var producerList = window.producerList;
    for (var i = 0; i < producerList.length; i++) {
      var self = this;
      var targetProducerObj = document.getElementById(producerList[i].id);

      function refreshData(targetProducerObj) {
        self.get(producerList[i].API_URL + '/v1/chain/get_info', function (data) {
          targetProducerObj.querySelector('.item-last-block').innerText = data.last_irreversible_block_num;
          targetProducerObj.querySelector('.item-time').innerText = data.head_block_time;
        }, function (error) {
          console.log(error);
        });
      }

      refreshData(targetProducerObj);
    }

    setTimeout(function () {
      self.updateData();
    }, 3000);
  },
  // HTTP GET REQUEST
  get: function (url, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
      if (request.status === 200) {
        successCallback(JSON.parse(request.responseText));
      }
      else {
        errorCallback(request);
      }
    };

    request.onerror = function (request) {
      // There was a connection error of some sort
      errorCallback(request);
    };

    request.send();
  }
};

ScholarTest.init();