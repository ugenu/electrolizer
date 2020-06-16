import assert from 'assert';
import { Electrolizer, ElectrolizerType } from '../../../src/electrolizer.class';
import { BrowserView, BrowserWindow } from 'electron';
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
      window = new BrowserWindow({ x: -1920, y: 0, width: 1080, height: 1080, show: true}); 
      elec = new Electrolizer(window);
    });


    afterEach(async () => {
      window.destroy();
    });

    afterAll((done) => {
      server.close(done);
    });


    it('should reject with a useful message when no URL', async () => {
      //@ts-ignore
      //await assert.rejects(elec.goto(undefined).run);
    });

    it('should reject with a useful message for an empty URL', async () => {
      //await assert.rejects(elec.goto('').run);
    });

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
      assert.rejects(elec.goto(fixture('navigation')).wait(function(_done) { return false; }).run)
    });

    
  });
});