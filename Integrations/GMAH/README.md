The exercise was really fun, as I've never used the GraphQL engine before. I knew the theory behind it and have seen it in action but never landed hands on it. Unfortunately, I'm delivering this exercise a little later than expected because I miss understood a part of the assignment. At first, I did not follow the OpenAPI specifications so I came up with the requests method, error formatting, schema. Later, as I was about to publish it, I realized I missed the last section of the assignment. To avoid further restitution delays, I partially implemented most of the schemas.

## Feedback
- For the mutation, we can only provide one of the children's ages because the type of the field is set to int

## Optimization
- Sanitize data for more security and error handling
- Use the pagination with the cursor
- Make more commit
- Convert currencies
- Document code with more comments
- Create a test library using jest and faker
- On the query filters, I could have had parsed the array once for the rooms and used the filter plus the mapping at once with the use of a reduce but for more readability, I left it like that

