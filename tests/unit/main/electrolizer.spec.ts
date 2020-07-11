import assert from 'assert';
import { Electrolizer, ElectrolizerType } from '../../../src/electrolizer.class';
import { BrowserView, BrowserWindow, protocol } from 'electron';
import { app } from '../../helpers/server';
import { Server } from 'http';
import { resolve } from 'url'

describe("Electrolizer", () => {
  it('should properly tell what type of bus is being used', () => {
    /*
    let view = new BrowserView();
    let window = new BrowserWindow();
    let viewDriver = new Electrolizer(view);
    let windowDriver = new Electrolizer(window);

    assert.equal(viewDriver.busType, ElectrolizerType.browserView);
    assert.equal(windowDriver.busType, ElectrolizerType.browserWindow);

    view.destroy();
    window.destroy();
    */
  });

  it('should do stuff decently well', async () => {
    /*
    let window = new BrowserWindow({ x: -1920, y: 0, width: 1080, height: 1080, show: true});
    let windowDriver = new Electrolizer(window);

    await windowDriver
      .goto('https://duckduckgo.com/')
      .wait(2000)
      .type('#search_form_input_homepage', 'butter')
      .click('#search_button_homepage')
      .wait(2000)
      .run();

    window.destroy();
    */
  }, 20000);

  describe("nightmare inspired - testing", () => {
    const port = 1997;
    let server:Server;
    
    let window: BrowserWindow;
    let elec: Electrolizer<BrowserWindow>;

    let fixture = (path: string): string => {
      return resolve(`http://localhost:${port}`, path);
    };

    beforeAll((done) => {
      server = app.listen(port, done);
    });

    beforeEach(async () => {
      window = new BrowserWindow({ x: -1920, y: 0, width: 1080, height: 1080, show: false }); 
      elec = new Electrolizer(window);
    });


    afterEach(async () => {
      window.destroy();
    });

    afterAll((done) => {
      server.close(done);
    });


    describe('navigation', () => {
      it('should reject with a useful message when no URL', async () => {
        //@ts-ignore
        await assert.rejects(elec.goto(undefined).run);
      });
  
      it('should reject with a useful message for an empty URL', async () => {
        await assert.rejects(elec.goto('').run);
      });
  
      /**
       * TODO: make sure this works all the time
       */
      it('should click on a link and then go back', async () => {
        let title = await elec.goto(fixture('navigation'))
          .click('a')
          .evaluate(() => {
            return document.title;
          });
        
        assert.equal(title, 'A');
  
        title = await elec.back().evaluate(() => {
          return document.title
        });
  
        assert.equal(title, 'Navigation');
      });
  
      /**
       * TODO: make sure this works all the time
       */
      it('should work for links that dont go anywhere', async () => {
        let title = await elec.goto(fixture('navigation'))
          .click('a')
          .evaluate(() => {
            return document.title;
          });
        
        assert.equal(title, 'A');
  
        title = await elec.click('.d').evaluate(() => {
          return document.title
        });
  
        assert.equal(title, 'A');
      });
  
      it('should click on a link, go back, and then go forward', async () => {
        await elec.goto(fixture('navigation'))
          .click('a')
          .back()
          .forward()
          .run();
      });
  
      it('should refresh the page', async () => {
        await elec.goto(fixture('navigation'))
          .refresh()
          .run();
      });
  
      it('should wait until element is present', async () => {
        await elec.goto(fixture('navigation'))
          .wait('a')
          .run();
      });
  
      it('should soft timeout if element does not appear', async () => {
        await elec.goto(fixture('navigation'))
          .wait('ul', 150)
          .run();
      });
  
      it('should escape the css selector correctly when waiting for an element', async () => {
        await elec.goto(fixture('navigation')).wait('#escaping\\:test').run();
      });
  
      it('should wait until the evaluate fn returns true', async () => {
        await elec.goto(fixture('navigation')).wait(function() {
          //@ts-ignore
          var text = document.querySelector('a').textContent
          return text === 'A'
        }).run();
      });
  
      it('should wait until the evaluate fn with arguments returns true', async () => {
        await elec.goto(fixture('navigation')).wait(
          function(expectedA, expectedB) {
            //@ts-ignore
            var textA = document.querySelector('a.a').textContent
            //@ts-ignore
            var textB = document.querySelector('a.b').textContent
            return expectedA === textA && expectedB === textB
          },
          'A',
          'B'
        ).run();
      });
    });


    describe('asynchronous wait', () => {
      it('should wait until the evaluate fn with arguments returns true with a promise', async () => {
        await elec.goto(fixture('navigation')).wait(
          function(expectedA, expectedB) {
            return new Promise<boolean>(function(resolve) {
              setTimeout(() => {
                //@ts-ignore
                var textA = document.querySelector('a.a').textContent
                //@ts-ignore
                var textB = document.querySelector('a.b').textContent
                resolve(expectedA === textA && expectedB === textB)
              }, 2000)
            })
          },
          'A',
          'B'
        ).run();
      });
  
      it('should reject timeout on wait', async () => {
        await assert.rejects(elec.goto(fixture('navigation')).wait(async () => { 
          return await new Promise<boolean>((resolve) => {
            //never resolve
          });
        }).run)
      });
  
      it('should reject timeout on wait with selector', async () => {
        await assert.rejects(elec.goto(fixture('navigation')).wait('#non-existent').run);
      });
  
      it('should run multiple times before timeout on wait', async () => {
        await assert.rejects(elec.goto(fixture('navigation')).wait(function() { return false; }).run)
      });
  
      it('should fail if navigation target is invalid', async () => {
        await assert.rejects(elec.goto('http://this-is-not-a-real-domain.tld').run)
  
        try {
          let response = await elec.goto('http://this-is-not-a-real-domain.tld').run();
        } catch (error){
          assert.equal(error.code, 'ERR_NAME_NOT_RESOLVED')
          assert.equal(error.errno, -105)
          assert.equal(error.url, 'http://this-is-not-a-real-domain.tld/')
          return
        }
  
        throw new Error('Error should have occured');
      });
  
      it('should fail if navigation target is a malformed URL', async () => {
        await assert.rejects(elec.goto('somewhere out there').run)
      });
  
      it('should fail if navigating to an unknown protocol', async () => {
        await assert.rejects(elec.goto('fake-protocol://blahblahblah').run)
      });
  
      it('should not fail if the URL loads but a resource fails', async () => {
        await elec.goto(fixture('navigation/invalid-image')).run();
      });
  
      it('should not fail if a child frame fails', async () => {
        await elec.goto(fixture('navigation/invalid-frame')).run();
      });
  
      it('should return correct data when child frames are present', async () => {
        await elec.goto(fixture('navigation/valid-frame')).run();
        //@ts-ignore
        let url = await elec.evaluate(() => { return window.location.href });
  
        assert.equal(url, fixture('navigation/valid-frame'));
      });
  
      it('should not fail if response was a valid error (e.g. 404)', async () => {
        await elec.goto(fixture('navigation/not-a-real-page')).run();
      });
  
      it('should fail if the response dies in flight', async () => {
        await assert.rejects(elec.goto(fixture('do-not-respond')).run);
      });
  
      it('should not fail for a redirect', async () => {
        await elec.goto(fixture('redirect?url=%2Fnavigation')).run();
      });
  
      it('should fail for a redirect to an invalid URL', async () => {
        await assert.rejects(elec.goto(fixture('redirect?url=http%3A%2F%2Fthis-is-not-a-real-domain.tld')).run);
      });
  
      it.todo('should succeed properly if request handler is present');
  
      it.todo('should fail properly if request handler is present');
  
      it.skip('should support javascript URLs', async () => {
        await elec
          .goto(fixture('navigation'))
          .goto('javascript:void(document.querySelector(".a").textContent="LINK");')
          .run();
  
        //@ts-ignore
        let linkText = await elec.evaluate(() => document.querySelector('.a').textContent);
  
        assert.equal(linkText, 'LINK');
      });
  
      it.skip('should support javascript URLs that load pages', async () => {
  
      });
  
      it('should fail immediately/not time out for 304 statuses', async () => {
  
      });
    });

    describe('manipulation', () => {
      it('should inject javascript onto the page', async () => {
        let globalNumber: number = await elec.goto(fixture('manipulation'))
          .inject('js', 'tests/helpers/files/globals.js')
          .evaluate(function() {
            return globalNumber
          })
        assert.equal(globalNumber, 7);

        let numberAnchors: number = await elec
          .goto(fixture('manipulation'))
          .inject('js', 'tests/helpers/files/jquery-2.1.1.min.js')
          .evaluate(function() {
            //@ts-ignore
            return window.$('h1').length
          });
        
        assert.equal(numberAnchors, 1);
      });

      it('should inject javascript onto the page ending with a comment', async () => {
        let numberAnchors: number = await elec
          .goto(fixture('manipulation'))
          .inject('js', 'tests/helpers/files/jquery-1.9.0.min.js')
          .evaluate(function() {
            //@ts-ignore
            return window.$('h1').length
          });
        
        assert.equal(numberAnchors, 1);
      });

      it('should inject css onto the page', async () => {
        let color: string = await elec.goto(fixture('manipulation'))
          .inject('js', 'tests/helpers/files/jquery-2.1.1.min.js')
          .inject('css', 'tests/helpers/files/test.css')
          .evaluate(function() {
            //@ts-ignore
            return window.$('body').css('background-color')
          });

        assert.equal(color, 'rgb(255, 0, 0)');
      });

      it('should not inject unsupported types onto the page', async () => {
        let color: string = await elec.goto(fixture('manipulation'))
          .inject('js', 'tests/helpers/files/jquery-2.1.1.min.js')
          //@ts-ignore
          .inject('pdf', 'tests/helpers/files/test.css')
          .evaluate(function() {
            //@ts-ignore
            return window.$('body').css('background-color')
          });

        assert.notEqual(color, 'rgb(255, 0, 0)');
      });
    });
  });
});