This was a really fun exercise to do as I've never use the GraphQL engine before. I knew the theory behind and have seen it in action but never landed hands on it. Unfortunately, I'm delivering this exercice later than expected because I miss understood a part of the assignement. At first, I did not follow the OpenAPI specifications so I came up with the requests method, error formatting, schema and then as I was about to publish it, I realised I missed the last section of the assignement. In order to not delay the restitution of the exercice futhermore, I implemented most of the schemas partially.

## Feedback
- For the mutation, we can only provide one children age because the type of the field is set to int

## Optimization
- Sanitize data for more security and error handling
- Use the pagination with the cursor
- Make more commit
- Convert currencies
- Document code with more comments
- Create a test library using jest and faker
- On the query filters, I could have had parse the array once for the rooms and do the filter + mapping at once using a reduce but for more readibility, I left it like that.

