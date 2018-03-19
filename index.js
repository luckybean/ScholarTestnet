/**
 * @author yahuang.wu
 * @date : 2018.03.19
 * @desc : generate and refresh block producer data
 */

var ScholarTest = {
  producerList: window.producerList,
  init: function () {

    document.getElementById('configuredProducer').innerText = this.producerList.length.toString();

    this.generateProducerTable();
    this.updateData();
  },
  // load 21 BP's info from producer.js, then generate the BP HTML table.
  generateProducerTable: function () {
    var producerList = this.producerList;
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
    var producerList = this.producerList;
    for (var i = 0; i < producerList.length; i++) {
      var self = this;

      function refreshData() {
        var targetProducerObj = document.getElementById(producerList[i].id);
        self.get(producerList[i].API_URL + '/v1/chain/get_info', function (data) {
          targetProducerObj.querySelector('.item-last-block').innerText = data.last_irreversible_block_num;
          targetProducerObj.querySelector('.item-time').innerText = data.head_block_time;
        });
      }

      refreshData();
      setTimeout(function () {
        self.updateData();
      }, 3000);
    }
  },
  // HTTP GET REQUEST
  get: function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        callback(data);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
    };

    request.send();
  }
};

ScholarTest.init();