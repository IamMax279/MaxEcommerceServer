# MaxEcommerceServer #
This is an examplary api for an ecommerce platform.

## Tech Stack ##
- Nestjs
- Prisma
- Postgres
- Redis
- Docker & Docker-compose

## Running the api locally ##
To run the api on your machine, you'll need to implement the following in the docker-compose and .env files:
- pg username
- pg password
- jwt secret key

The api uses nodemailer for sending emails, so you'll need to use your own email and app password for your google account (if you want to use gmail transporter).
