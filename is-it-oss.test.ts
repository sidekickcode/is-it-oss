import isOpenSource, { OssStatus } from "./is-it-oss";
import { assert } from "chai";

describe("openSourceStatus", function() {

  this.timeout(5000);

  before(function() {
    assert.property(process.env, "PRIVATE_KEY"); 
  })

  it("rejects for unresolvable domains", function() {
    return assertIsRejected(assertOpenSource('https://sidekicktest@xaomsadoim.notathing/sidekicktest2/private.git'));
  })

  it("rejects for missing repos", function() {
    return assertIsRejected(assertOpenSource('https://zximxcoizmzxoicaosijdqowijd@bitbucket.org/noasjdoiajsdt.git'));
  })
    

  describe("detecting open source status for github", function() {

    describe("open source", function() {
      it("works with HTTPs URLs", function() {
        return assertOpenSource('https://github.com/sidekickcode/tracker.git');
      })

      it("works with SSL URLs", function() {
        return assertOpenSource('git@github.com:sidekickcode/tracker.git' );
        
      })
          
    })

    describe("closed source", function() {
      it("works with HTTPs URLs", function() {
        return assertNotOpenSource('https://github.com/timruffles/sk-deployed.git');
      })

      it("works with SSL URLs", function() {
        return assertNotOpenSource('git@github.com:timruffles/sk-deployed.git');
      })
          
    })

      
  })

  describe("detecting open source status for bitbucket", function() {

    describe("open source", function() {
      it("works with HTTPs URLs", function() {
        return assertOpenSource('https://sidekicktest@bitbucket.org/sidekicktest/public.git');
      })

      it("works with SSL URLs", function() {
        return assertOpenSource('git@bitbucket.org:sidekicktest/public.git');
        
      })
          
    })

    describe("closed source", function() {
      it("works with HTTPs URLs", function() {
        return assertNotOpenSource('https://sidekicktest@bitbucket.org/sidekicktest2/private.git');
      })

      it("works with SSL URLs", function() {
        return assertNotOpenSource('git@bitbucket.org:sidekicktest2/private.git');
      })
          
    })

  })


})

function getOssStatus(url: string) {
  return isOpenSource(url);
}

function assertOpenSource(url: string) {
  return getOssStatus(url).then((s: OssStatus) => assert.isTrue(s.oss, `expected ${url} to be oss`));
}

function assertNotOpenSource(url: string) {
  return getOssStatus(url).then((s: OssStatus) => assert.isFalse(s.oss, `expected ${url} not to be oss`));
}


function assertIsRejected(x: Promise<any>) {
  return x
   .then(() => { throw Error("should have rejected") })
   .catch(() => "ok")
}
