import { TestBed } from '@angular/core/testing';

import { LoadListsService } from './load-lists.service';

describe('LoadListsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadListsService = TestBed.get(LoadListsService);
    expect(service).toBeTruthy();
  });
});
