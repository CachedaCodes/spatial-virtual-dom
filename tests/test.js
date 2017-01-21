/**
 * Testing testing test
 */

var expect = require('chai').expect;

describe('Testing tests', function () {
  it('should run this test', function () {
    expect(2 + 2).to.be.equal(4);
  });
  it('should check something else', function () {
    expect(true).to.be.true;
  });
  it('should break the tests', function () {
//    expect(false, 'breaking breaks').to.be.true;
  });
});
