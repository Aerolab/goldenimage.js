import goldenimage from '../../src/goldenimage.js';

describe('goldenimage', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(goldenimage, 'greet');
      goldenimage.greet();
    });

    it('should have been run once', () => {
      expect(goldenimage.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(goldenimage.greet).to.have.always.returned('hello');
    });
  });
});
