## Instagram scraping CLI
### Pre-setup

Set in the file ".env" your instagram username and password. By replacing, the following environment variables.
```
INST_USERNAME=your_instagram_username
INST_PASSWORD=your_instagram_password
```
Run the following command in terminal to install the project dependencies:
```
npm i
```

### Supported functions

For scrape use command:
```
npm start YOUR_URL
```

Supports the following functionality:
```
Download any user post(photo(s), video(s));
Download user story;
Download user stories highlights.
```
### Example

I want to get a regular photo from the specified link. you need to run the following command in the terminal. Similar to other types.

```
npm start https://www.instagram.com/p/CKYcQg0HMRq/
```