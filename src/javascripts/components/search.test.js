import Search from './search';

const jobs = [
  {
    id: '1',
    content: 'I am a designer, watch me!',
    location: 'London, United Kingdom',
    capability: 'Design'
  },
  {
    id: '2',
    content: 'I am another designer, watch me!',
    location: 'Belfast, United Kingdom',
    capability: 'Design'
  },
  {
    id: '3',
    content: 'I am an engineer, watch me engineer in AWS!',
    location: 'London, United Kingdom',
    capability: 'Engineering & DevOps'
  }
]

test('returns all results when no filters are applied', () => {
  const search = new Search([]);
  const filteredJobs = search.filterJobs(jobs, {});

  expect(filteredJobs.length).toBe(jobs.length);
});

test('filters by full keyword', () => {
  const search = new Search([]);
  const filteredJobs = search.filterJobs(jobs, { q: 'AWS' });

  expect(filteredJobs.length).toBe(1);
});

test('filters by partial keyword', () => {
  const search = new Search([]);
  const filteredJobs = search.filterJobs(jobs, { q: 'design' });

  expect(filteredJobs.length).toBe(2);
});

test('filters by location', () => {
  const search = new Search([]);
  const location = 'Belfast, United Kingdom';
  const filteredJobs = search.filterJobs(jobs, { location });

  expect(filteredJobs.length).toBe(1);
  expect(filteredJobs[0].location === location)
});

test('filters by capability', () => {
  const search = new Search([]);
  const capability = 'Engineering & DevOps';
  const filteredJobs = search.filterJobs(jobs, { capability });

  expect(filteredJobs.length).toBe(1);
  expect(filteredJobs[0].capability === capability)
});
