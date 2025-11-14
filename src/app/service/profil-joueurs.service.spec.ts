import { TestBed } from '@angular/core/testing';

import { ProfilJoueursService } from './profil-joueurs.service';

describe('ProfilJoueursService', () => {
  let service: ProfilJoueursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilJoueursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
