// https://github.com/request/request

const request = require('request');
const fs = require('fs');
const urlencode = require('urlencode');

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    // var info = JSON.parse(body);
  }
}

function isJSON(data) {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Query the available quota.
 */
function queryQuota() {
  let options = {
    url: 'https://cloud.dynamsoft.com/rest/ocr/v1/quota?method=page',
    method: 'GET',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ=='
    }
  };
  request(options, callback);
}

/**
 * Query available disk space.
 *
 */
function queryDisk() {
  let options = {
    url: 'https://cloud.dynamsoft.com/rest/ocr/v1/quota?method=disk',
    method: 'GET',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ=='
    }
  };
  request(options, callback);
}

/**
 * Upload an image file to the remote server.
 *
 * @param {String=} fileName
 */
function uploadFile(fileName) {
  let formData = {
    file_name: 'nodejs-test',
    file: fs.createReadStream(__dirname + '/' + fileName),
  };

  let options = {
    url: 'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=upload',
    method: 'POST',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ==',
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
 */
function doOCR(data) {
  let formData = {
    language: 'eng',
    output_format: 'DOCX',
    param: JSON.stringify(data)
  };

  let options = {
    url: 'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=recognize',
    method: 'POST',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ==',
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
 */
function downloadFile(fileName) {
  let url =
      'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=download&file_name=' +
      urlencode(fileName);

  let options = {
    url: url,
    method: 'GET',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ==',
    }
  };

  let downloadCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      if (isJSON(body)) {
        console.log(body);
      } else {
        console.log('The file has been saved!');
      }
    }
  };
  request(options, downloadCallback).pipe(fs.createWriteStream(fileName));
}

/**
 * Delete a file
 *
 * @param {String=} fileName
 */
function deleteFile(fileName) {
  let url =
      'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=delete&file_name=' +
      urlencode(fileName);

  let options = {
    url: url,
    method: 'POST',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ==',
    }
  };
  request(options, callback);
}

/**
 * Delete multiple files.
 *
 * @param {Object=} data - E.g. {"list":[{"file_name":"1.jpg"},{"file_name
 * ":"2.jpg"}]}
 */
function deleteMultiFiles(data) {
  let formData = {param: JSON.stringify(data)};

  let options = {
    url: 'https://cloud.dynamsoft.com/rest/ocr/v1/file?method=delete',
    method: 'POST',
    headers: {
      'x-api-key': 'ahLnMk8OKTX0OeiB0Cd/DS7BBLU5WGw0vn4nLVkqFjLwIjTZXqHOYQ==',
      'content-type': 'multipart/form-data'
    },
    formData: formData
  };
  request(options, callback);
}

// queryQuota();
// queryDisk();
// uploadFile('nodejs-test.PNG');

// Delete multiple files
// const files = ['nodejs-test.PNG'];
// let fileList = [];
// files.forEach(function(element) {
//   fileList.push({'file_name': element});
// }, this);

// let data = {'list': fileList};
// doOCR(data);
downloadFile('nodejs-test.docx');