"use strict";
var Reporter = require('../../src/reporter'),
  FileTypeBuilder = require('../../test/fileTypeBuilder'),
  sinon = require('sinon');

describe('reporter', function() {
  it('should log the overview statistics', function() {
    var stats = {totalNumberOfLines : 1, totalNumberOfFiles : 9876, fileTypes : []},
      mockConsole,
      logger = {log : function() {/*This will get mocked out*/}},
      reporter;

    mockConsole = sinon.mock(logger);
    mockConsole.expects("log").once().withArgs("9876 1");

    reporter = new Reporter(mockConsole.object);
    reporter.report(stats);

    mockConsole.verify();
  });

  it('should log the fileType statistics', function() {
    var types = new FileTypeBuilder().withTypes([".js", ".txt"]).build(),
      stats = {totalNumberOfLines : 99, totalNumberOfFiles : 88, fileTypes : types},
      mockConsole,
      logger = {log : function() {/*This will get mocked out*/}},
      reporter;

    mockConsole = sinon.mock(logger);
    mockConsole.expects("log").once().withArgs("88 99");
    mockConsole.expects("log").once().withArgs(".js 0 0");
    mockConsole.expects("log").once().withArgs(".txt 0 0");

    reporter = new Reporter(mockConsole.object);
    reporter.report(stats);

    mockConsole.verify();
  });
});