import { Logger, LogLevel, LogOutput } from './logger.service';
import { fakeAsync, tick } from '@angular/core/testing';

const logMethods = ['log', 'info', 'warn', 'error'];

describe('Logger', () => {
  let savedConsole: Function[];
  let savedLevel: LogLevel;
  let savedOutputs: LogOutput[];

  beforeAll(() => {
    savedConsole = [];
    logMethods.forEach(m => {
      savedConsole[m] = console[m];
      console[m] = () => {};
    });
    savedLevel = Logger.level;
    savedOutputs = Logger.outputs;
  });

  afterAll(() => {
    logMethods.forEach(m => {
      console[m] = savedConsole[m];
    });
    Logger.level = savedLevel;
    Logger.outputs = savedOutputs;
  });

  it('should create an instance', () => {
    expect(new Logger()).toBeTruthy();
  });

  it('should add a new LogOutput and receives log entries', fakeAsync(() => {
    // Arrange
    const outputSpy = jasmine.createSpy('outputSpy');
    const log = new Logger('test');

    // Act
    Logger.outputs.push(outputSpy);

    log.debug('d');
    log.info('i');
    log.warn('w');
    log.error('e', { error: true });

    tick();

    // Assert
    expect(outputSpy).toHaveBeenCalled();
    expect(outputSpy.calls.count()).toBe(2);
  }));

  it('should add a new LogOutput and receives only production log entries', fakeAsync(() => {
    // Arrange
    const outputSpy = jasmine.createSpy('outputSpy');
    const log = new Logger('test');

    // Act
    Logger.outputs.push(outputSpy);
    Logger.enableProductionMode();

    log.debug('d');
    log.info('i');
    log.warn('w');
    log.error('e', { error: true });

    tick();

    // Assert
    expect(outputSpy).toHaveBeenCalled();
    expect(outputSpy.calls.count()).toBe(2);
  }));
});
