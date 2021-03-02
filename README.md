## Instagram scraping CLI
### Pre-setup

Set in the file ".env" your instagram username and password. By replacing, the following environment variables.
```
INST_USERNAME=your_instagram_username
INST_PASSWORD=your_instagram_password
```

### Supported functions

For scrape use command:
```
node scrape.js selected_type you_url
```

Supported types:
```
p - default photo
v - default photo
sp - stories with photo
sv - stories with video
sh - stories highlights
```
### Example

I want to get a regular photo from the specified link. you need to run the following command in the terminal. Similar to other types.

```
node scrape.js photo https://www.instagram.com/p/CKYcQg0HMRq/
```