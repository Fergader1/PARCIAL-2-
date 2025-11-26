import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Character } from '../interfaces/character';
// ESTAS DOS LÍNEAS SON VITALES PARA QUE NO HAYA ERRORES:
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  // ... resto del código ...
  private KEY = 'nanatsu_favorites';
  
  // 1. Creamos una fuente de verdad reactiva
  private _favoritesSubject = new BehaviorSubject<Character[]>([]);
  
  // 2. Exponemos un Observable público para que los componentes se suscriban
  public favorites$ = this._favoritesSubject.asObservable();

  constructor() {
    this.initialLoad();
  }

  private async initialLoad() {
    const { value } = await Preferences.get({ key: this.KEY });
    const favs = value ? JSON.parse(value) : [];
    // Emitimos el valor inicial a todos los suscriptores
    this._favoritesSubject.next(favs);
  }

  getFavoritesValue(): Character[] {
    return this._favoritesSubject.value;
  }

  // Verificar si es favorito de manera reactiva o puntual
  isFavorite(id: string): boolean {
    return this._favoritesSubject.value.some(c => c.id === id);
  }

  isFavorite$(id: string): Observable<boolean> {
    return this.favorites$.pipe(
      map(favs => favs.some(c => c.id === id))
    );
  }

  async toggleFavorite(character: Character) {
    let currentFavs = this._favoritesSubject.value;
    const exists = currentFavs.some(c => c.id === character.id);

    if (exists) {
      currentFavs = currentFavs.filter(c => c.id !== character.id);
    } else {
      currentFavs = [...currentFavs, character];
    }

    // 1. Actualizamos el Storage
    await Preferences.set({
      key: this.KEY,
      value: JSON.stringify(currentFavs)
    });

    // 2. Avisamos a toda la app del cambio
    this._favoritesSubject.next(currentFavs);
  }

  async clearAll() {
    await Preferences.remove({ key: this.KEY });
    this._favoritesSubject.next([]);
  }
}