'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');
// const testSchema = require('../mock-schema.graphql')
const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '../../server/__tests__/mock-schema.graphql'),
  'utf8'
);

describe('Testing schema, Query', () => {
  let tester;
  beforeAll(() => {
    tester = new EGQLT(schema);
  });
  describe('Should pass if the root level user query is valid.', () => {
    it('Valid query getUsers', () => {
      const validQuery = `
 {
  users {
   id
   thirdPartyUID
   firebaseUID
   username
   email
   userProfileImage
   bio
   privilege
   stripeId
   accountType
  }
 }
`;
      tester.test(true, validQuery);
    });
  });
  describe('Should pass iff the root level user query is invalid', () => {
    it('Invalid query getUsers', () => {
      const invalidQuery = `
     {
      getUsers {
       id
       thirdPartyUID
       firebaseUID
       username
       email
       invalidField
       userProfileImage
       bio
       privilege
       stripeId
       accountType
       ReviewList
       LikedReviews
       DislikedReviews
       Projects
       RatedProjects
      }
     }
    `;
      tester.test(false, invalidQuery);
    });
  });

  describe('Should pass if the nested user query is valid.', () => {
    it('Valid Query', () => {
      const validNestedUserQuery = `
   {
    users {
      id
      username
      userProfileImage
      bio
      email
      RatedProjects {
        id
      }
      ReviewList {
        id
        name
        text
        timestamp
        thumbsUp
        thumbsDown
        Author {
          id
          username
          email
        }
        ProjectReviewed {
          id
          name
          titleImg
        }
      }
      LikedReviews {
        id
        name
        text
        timestamp
        thumbsUp
        thumbsDown
        Author {
          id
          username
          email
        }
        ProjectReviewed {
          id
          name
          titleImg
        }
      }
      DislikedReviews {
        id
        name
        text
        timestamp
        thumbsUp
        thumbsDown
        Author {
          id
          username
          email
        }
        ProjectReviewed {
          id
          name
          titleImg
        }
      }
    }
  }`;
      tester.test(true, validNestedUserQuery);
    });
  });

  describe('Should pass iff the nested user query is invalid.', () => {
    it('Invalid Query', () => {
      const invalidNestedUserQuery = `
  {
   users {
     id
     username
     invalidField
     userProfileImage
     bio
     email
     RatedProjects {
       id
     }
     ReviewList {
       id
       name
       text
       timestamp
       thumbsUp
       thumbsDown
       Author {
         id
         username
         email
       }
       ProjectReviewed {
         id
         name
         titleImg
       }
     }
     LikedReviews {
       id
       name
       text
       timestamp
       thumbsUp
       thumbsDown
       Author {
         id
         username
         email
       }
       ProjectReviewed {
         id
         name
         titleImg
       }
     }
     DislikedReviews {
       id
       name
       text
       timestamp
       thumbsUp
       thumbsDown
       Author {
         id
         username
         email
       }
       ProjectReviewed {
         id
         name
         titleImg
       }
     }
   }
 }`;
      tester.test(false, invalidNestedUserQuery);
    });
  });

  // describe('Should pass if the nested user query is invalid.', () => {
  //  it('', () => {});
  // });
});

// describe('Testing schema, Mutation', () => {
// it('Should pass if the mutation input is valid', () => {
//  const User = {
// {data:   User: {
//      username: 'test',
//      thirdPartyUID: 'test',
//      firebaseUID: 'test',
//      email: 'test',
//      userProfileImage: 'test',
//      bio: 'test',
//      privilege: 'test',
//      stripeId: 'test',
//      accountType: 'test',
//    }
//   }
//  };

const input = {
  data: {
    User: {
      username: 'test',
      thirdPartyUID: 'test',
      firebaseUID: 'test',
      email: 'test',
      userProfileImage: 'test',
      bio: 'test',
      privilege: 'test',
      stripeId: 'test',
      accountType: 'test'
    }
  }
};

const mutation = `
   mutation createUser($input: UserCreateInput!) {
    createUser(input: $input) {
     thirdPartyUID
     firebaseUID
     username
     email
     userProfileImage
     bio
     privilege
     stripeId
     accountType
    }
   }
  `;

const testfn = new EGQLT(schema);
const {
  data: { createUser }
} = testfn.mock({ query: mutation, variables: input });