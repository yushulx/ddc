var fs = require('fs');
var assert = require('assert');
var DDC = require('../dist/ddc');
// Please get your API key from
// https://cloud.dynamsoft.com/ocr/ocr-api-key-settings.aspx.
var key = ''; // Set your API key.
var ddc = new DDC(key);

if (key === '') {
  return;
}

describe('/GET quota', function() {
  this.timeout(15000);
  it('should get available quota', (done) => {
    ddc.queryQuota(function(error, response, body) {
      assert.equal(200, response.statusCode);
      if (ddc.isJSON(body)) {
        let json = JSON.parse(body);
        assert.equal(0, json['error_code']);
      }
      if (error)
        done(error);
      else
        done();
    });
  });
});

describe('/GET disk', function() {
  this.timeout(15000);
  it('should get available disk space', (done) => {
    ddc.queryDisk(function(error, response, body) {
      assert.equal(200, response.statusCode);
      if (ddc.isJSON(body)) {
        let json = JSON.parse(body);
        assert.equal(0, json['error_code']);
      }
      if (error)
        done(error);
      else
        done();
    });
  });
});

describe('/POST upload a file', function() {
  this.timeout(15000);
  it('should upload a file', (done) => {
    ddc.uploadFile(
        'nodejs-test', __dirname + '/' +
                           'nodejs-test.PNG',
        function(error, response, body) {
          assert.equal(200, response.statusCode);
          if (ddc.isJSON(body)) {
            let json = JSON.parse(body);
            assert.equal(0, json['error_code']);
          }
          if (error)
            done(error);
          else
            done();
        });
  });
});

describe('/POST OCR a file', function() {
  this.timeout(15000);
  it('should OCR a file', (done) => {
    const files = ['nodejs-test.PNG'];
    let fileList = [];
    files.forEach(function(element) {
      fileList.push({'file_name': element});
    }, this);

    let data = {'list': fileList};
    ddc.doOCR(data, function(error, response, body) {
      assert.equal(200, response.statusCode);
      if (ddc.isJSON(body)) {
        let json = JSON.parse(body);
        assert.equal(0, json['error_code']);
      }
      if (error)
        done(error);
      else
        done();
    });
  });
});

describe('/GET download a file', function() {
  this.timeout(15000);
  it('should download a file', (done) => {
    const fileName = 'nodejs-test.docx';
    ddc.downloadFile(fileName, function(error, response, body) {
      assert.equal(200, response.statusCode);
      if (ddc.isJSON(body)) {
        let json = JSON.parse(body);
        assert.equal(0, json['error_code']);
      }
      if (error)
        done(error);
      else
        done();
    });

    after(function() {
      fs.unlink(
          '__dirname' +
              '/../' + fileName,
          (err) => {
            if (err) {
              console.log("Failed: " + err);
            } else {
              console.log('Successful deleted the test file');
            }
          });
    });
  });
});

describe('/POST delete a file', function() {
  this.timeout(15000);
  it('should delete a file', (done) => {
    ddc.deleteFile('nodejs-test.docx', function(error, response, body) {
      assert.equal(200, response.statusCode);
      if (ddc.isJSON(body)) {
        let json = JSON.parse(body);
        assert.equal(0, json['error_code']);
      }
      if (error)
        done(error);
      else
        done();
    });
  });
});

// describe('/POST delete multiple files', function() {
//   it('should delete multiple files', (done) => {
//     const files = ['nodejs-test.docx', 'nodejs-test(0).docx'];
//     let fileList = [];
//     files.forEach(function(element) {
//       fileList.push({'file_name': element});
//     }, this);

//     let data = {'list': fileList};
//     ddc.deleteMultiFiles(data, function(error, response, body) {
//       assert.equal(200, response.statusCode);
//       if (ddc.isJSON(body)) {
//         let json = JSON.parse(body);
//         assert.equal(0, json['error_code']);
//       }
//       if (error)
//         done(error);
//       else
//         done();
//     });
//   });
// });