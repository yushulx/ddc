// https://github.com/request/request
var request = require('request');
var fs = require('fs');
var urlencode = require('urlencode');

var DDC = (function() {
  function DDC(key) {
      this.key = key;
  }

  DDC.prototype.callback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  };

  DDC.prototype.isJSON = function(data) {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  };

  /**
   * Query the available quota.
   * @param {requestCallback=} callback - function(error, response, body) {}
   */
  DDC.prototype.queryQuota = function(callback) {
    var options = {
      url: 'https://cloud.dynamsoft.com/rest/ocr/v1/quota?method=page',
      method: 'GET',
      headers: {
        'x-api-key': this.key
      }
    };
    request(options, callback);
  };

  /**
   * Query available disk space.
   * @param {requestCallback=} callback - function(error, response, body) {}
   */
  DDC.prototype.queryDisk = function(callback) {
    let options = {
      url: 'https://cloud.dynamsoft.com/rest/ocr/v1/quota?method=disk',
      method: 'GET',
      headers: {
        'x-api-key': this.key
      }
    };
    request(options, callback);
  };

  /**
 * Upload an image file to the remote server.
 *
 * @param {String=} fileName - E.g. nodejst-test
 * @param {String=} filePath - E.g. g:/nodejst-test.png
 * @param {requestCallback=} callback - function(error, response, body) {}
 */
  DDC.prototype.uploadFile = function(fileName, filePath, callback) {
    let formData = {
      file_name: fileName,
      file: fs.createReadStream(filePath),
    };

    let options = {
      url: 'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=upload',
      method: 'POST',
      headers: {
        'x-api-key': this.key,
        'content-type': 'multipart/form-data'
      },
      formData: formData
    };
    request(options, callback);
  }

  /**
   * Recognize text from uploaded images. Save content to different file types.
   * E.g. docx, pdf, epub, etc.
   *
   * @param {Object=} data - E.g. {"list":[{"file_name":"1.jpg"},{"file_name
   * ":"2.jpg"}]}
   * @param {requestCallback=} callback - function(error, response, body) {}
   */
  DDC.prototype.doOCR = function(data, callback) {
    let formData = {
      language: 'eng',
      output_format: 'DOCX',
      param: JSON.stringify(data)
    };

    let options = {
      url: 'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=recognize',
      method: 'POST',
      headers: {
        'x-api-key': this.key,
        'content-type': 'multipart/form-data'
      },
      formData: formData
    };
    request(options, callback);
  }

  /**
   * Download a file from the document repository.
   *
   * @param {String=} fileName
   * @param {requestCallback=} callback - function(error, response, body) {}
   */
  DDC.prototype.downloadFile = function(fileName, callback) {
    let url =
        'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=download&file_name=' +
        urlencode(fileName);

    let options = {
      url: url,
      method: 'GET',
      headers: {
        'x-api-key': this.key,
      }
    };

    request(options, callback).pipe(fs.createWriteStream(fileName));
  }

  /**
   * Delete a file
   *
   * @param {String=} fileName
   * @param {requestCallback=} callback - function(error, response, body) {}
   */
  DDC.prototype.deleteFile = function(fileName, callback) {
    let url =
        'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=delete&file_name=' +
        urlencode(fileName);

    let options = {
      url: url,
      method: 'POST',
      headers: {
        'x-api-key': this.key,
      }
    };
    request(options, callback);
  }

  /**
   * Delete multiple files.
   *
   * @param {Object=} data - E.g. {"list":[{"file_name":"1.jpg"},{"file_name
   * ":"2.jpg"}]}
   * @param {requestCallback=} callback - function(error, response, body) {}
   */
  DDC.prototype.deleteMultiFiles = function(data, callback) {
    let formData = {param: JSON.stringify(data)};

    let options = {
      url: 'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=delete',
      method: 'POST',
      headers: {
        'x-api-key': this.key,
        'content-type': 'multipart/form-data'
      },
      formData: formData
    };
    request(options, callback);
  }

  return DDC;
}());

module.exports = DDC;
