const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('should return an empty array given an empty array', () => {
    expect(formatDates([])).toEqual([]);
  });
  it('should return a formatted date array with one object, when passed an array with one object', () => {
    const myDate = 1471522072389;
    const input = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      created_at: myDate,
    }];
    const actual = formatDates(input);
    const expected = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      created_at: Date(myDate)
    }];
    expect(actual).toEqual(expected);
  });
  it('should return a formatted date array, when passed an array of objects', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        created_at: 1471522072389,
      },
      {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        created_at: 1500584273256,
      },
      {
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        created_at: 1500659650346,
      }
    ]
    const actual = formatDates(input);
    const expected = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        created_at: Date(input[0].created_at),
      },
      {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        created_at: Date(input[1].created_at),
      },
      {
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        created_at: Date(input[2].created_at),
      }
    ];
    expect(actual).toEqual(expected);
  });
  it('should not mutate the input array or the objects within', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        created_at: 1471522072389,
      }
    ];
    const formattedDates = formatDates(input);
    expect(formattedDates).not.toBe(input);
    expect(formattedDates).not.toBe(input[0]);
  });
});

describe('makeRefObj', () => {
  it('should return an empty object when passed an empty array', () => {
    expect(makeRefObj([])).toEqual({});
  });
  it('should return a refObj when passed an array with one object', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    const expected = {
      'Living in the shadow of a great man': 1
    }
    expect(actual).toEqual(expected);
  });
  it('should return a refObj when passed an array with multiple objects', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 2,
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 1500584273256,
      },
      {
        article_id: 3,
        title: '22 Amazing open source React projects',
        topic: 'coding',
        author: 'happyamy2016',
        body:
          'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
        created_at: 1500659650346,
      }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    const expected = {
      'Running a Node App': 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      '22 Amazing open source React projects': 3
    };
    expect(actual).toEqual(expected);
  });
  it('should not mutate the input array or objects', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ]
    const refObj = makeRefObj(input);
    expect(refObj).not.toBe(input);
    expect(input[0]).toEqual({
      article_id: 1,
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    });
  });
});

describe('formatComments', () => {
  it('should return an empty array when passed an empty array', () => {
    expect(formatComments([])).toEqual([]);
  });
  it('should return an an array with one formatted comment in it, when passed an array with one comment', () => {
    const input = [
      {
        body:
      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articlesRef = {
      "They're not exactly dogs, are they?": 1
    }
    const actual = formatComments(input, articlesRef);
    const expected = [
      {
        body:
    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(actual).toEqual(expected);
  });
  it('should return an array of formatted comments, when passed an array of multiple comments', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389,
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389,
      },
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389,
      }
    ];
    const articlesRef = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2
    }
    const actual = formatComments(input, articlesRef);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 2,
        author: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389,
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 2,
        author: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389,
      },
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 2,
        author: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389,
      }
    ];
    expect(actual).toEqual(expected);
  });
  it('should not mutate the array, or the comments in the array', () => {
    const input = [
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389,
      }
    ];
    const articlesRef = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2
    }
    const formattedComments = formatComments(input, articlesRef);
    expect(formattedComments).not.toBe(input);
    expect(formattedComments[0]).not.toBe(input[0]);
    expect(input[0]).toEqual({
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    });
  });
});
