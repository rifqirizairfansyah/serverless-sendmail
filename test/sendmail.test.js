const { mailer } = require('../handler');
const nodemailer = require('nodemailer');
const nodemailerMock = require('nodemailer-mock');
const { faker } = require('@faker-js/faker');

jest.mock('nodemailer');

describe('mailer function', () => {
  beforeEach(() => {
    nodemailer.createTransport.mockReturnValue(nodemailerMock.createTransport());
  });

  afterEach(() => {
    nodemailerMock.mock.reset();
  });

  it('should send email and return a success response', async () => {
    const event = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      type: 'birthday',
    };

    const response = await mailer(event);


    const sentMail = nodemailerMock.mock.getSentMail();

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    expect(sentMail).toHaveLength(1);
    expect(sentMail[0].from).toBe('erin@gmail.com');
    expect(sentMail[0].to).toBe(`${event.first_name}@gmail.com`);
    expect(sentMail[0].subject).toBe(`Hey this is your ${event.type}`);
    expect(sentMail[0].text).toBe(`Hello ${event.first_name} ${event.last_name}!.`);

    expect(response.statusCode).toBe(200);
  });

  it('should throw an error if sending email fails', async () => {
    const event = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      type: 'birthday',
    };

    nodemailerMock.mock.setShouldFailOnce();

    await expect(mailer(event)).rejects.toThrow();

    const sentMail = nodemailerMock.mock.getSentMail();

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    expect(sentMail).toHaveLength(0);
  });
});
