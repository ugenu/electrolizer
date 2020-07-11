import { Cookies } from "./drivers/cookies.interface";
import { Push } from "./evaluate-function.type";

export interface OperatorFunctions<T> {
  /**
   * Direct the ElectrolizerBus to a new URL
   * @param url 
   * @param headers NOT CURRENTLY SUPPORTED
   */
  goto(url: string, headers?: Record<string, string>): T;

  /**
   * Navigate backwards
   */
  back(): T;

  /**
   * Navigate forwards
   */
  forward(): T;

  /**
   * Reload the web page
   */
  refresh(): T;

  /**
   * Tell the ElectrolizerBus to click on a selector inside the page
   * @param selector 
   */
  click(selector: string): T;

  /**
   * Perform the mousedown event on a selector
   * @param selector 
   */
  mousedown(selector: string): T;

  /**
   * Perform the mouseup event on a selector
   * @param selector 
   */
  mouseup(selector: string): T;

  /**
   * Perform the mouseover event on a selector
   * @param selector 
   */
  mouseover(selector: string): T;

  /**
   * Perform the mouseout event on a selector
   * @param selector 
   */
  mouseout(selector: string): T;

  /**
   * Type the text into the selector input like a human would
   * @param selector 
   * @param text 
   */
  type(selector: string, text?: string): T;

  /**
   * Insert the text into the selector input like a robot would
   * @param selector 
   * @param text 
   */
  insert(selector: string, text?: string): T;

  /**
   * Check the input checkbox that belongs to the selector
   * @param selector 
   */
  check(selector: string): T;

  /**
   * Uncheck the input checkbox that belongs to the selector
   * @param selector 
   */
  uncheck(selector: string): T;

  /**
   * Set the value of the select dropdown at the selector to the option value
   * @param selector 
   * @param option 
   */
  select(selector: string, option?: string): T;

  /**
   * Scroll to the top/left position on the page
   * @param top 
   * @param left 
   */
  scrollTo(top: number, left: number): T;

  /**
   * Resize the viewport 
   * @param width 
   * @param height 
   */
  viewport(width: number, height: number): T;

  /**
   * Load a particular javascript or css file into the page
   * @param type 
   * @param file 
   */
  inject(type: 'js' | 'css', file: string): T;

  /**
   * Evaluate the javascript function inside the page
   * @param fn 
   * @param args 
   */
  evaluate<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): Promise<R>;

  /**
   * Wait for a number of milliseconds
   * @param ms 
   */
  wait(ms: number): T;

  /**
   * Wait for a selector to appear
   * @param selector 
   * @param ms soft timeout in ms (if provided will not throw if timeout is reached)
   */
  wait(selector: string, ms?: number): T;

  /**
   * Wait until the function evaluated inside the page returns true
   * @param fn 
   * @param args 
   */
  wait<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): T;

  /**
   * Set the header of the current page
   * @param header 
   * @param value 
   */
  header(header: string, value: string): T;

  /**
   * Return the current html contents of the webpage
   */
  html(): Promise<string>;

  /**
   * Returns true if the selector is within the page
   * @param selector 
   */
  exists(selector: string): Promise<boolean>;

  /**
   * Log into a basic-auth context using username and password 
   * @param username 
   * @param password 
   */
  authentication(username: string, password: string): T;

  /**
   * set the useragent of the ElectrolizerBus (should be called before .goto)
   * @param useragent 
   */
  useragent(useragent: string): T;
  
  /**
   * the cookies object that manages session data
   */
  cookies: Cookies<T>
}