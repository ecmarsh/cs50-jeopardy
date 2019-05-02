function Car(brand, models) {
  this.brand = brand;
  this.models = models;
}

Car.prototype.fetchCarInfo = function() {
  return new Promise((resolve, reject) => {
    // Simulate an API
    setTimeout(() => resolve(this.models), 0); //1000);
  });
};

describe('mocking works', () => {
  it('is evaluating correctly', () => {
    const mb = new Car('Mercedes-Benz', ['C', 'E', 'S']);
    expect(mb.brand).toBe('Mercedes-Benz');
  });

  it('is working with mock functions', async () => {
    const mb = new Car('Mercedes-Benz', ['C', 'E', 'S']);
    // mock car info fn
    mb.fetchCarInfo = jest.fn().mockResolvedValue(['C300', 'S550']);
    const mbModels = await mb.fetchCarInfo();
    expect(mbModels).toContain('C300');
  });
});
