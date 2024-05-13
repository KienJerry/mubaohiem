/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DOMAIN_URL, // FIXME: Change to the production URL
  generateRobotsTxt: true,
}
