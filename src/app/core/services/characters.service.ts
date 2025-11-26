import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Character } from '../interfaces/character';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private dataUrl = 'assets/data/data.json';
  
  // 1. Variable para Cache (Memoización)
  private cache: Character[] | null = null;

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<Character[]> {
    // 2. Si ya tenemos datos en memoria, los devolvemos sin hacer petición HTTP
    if (this.cache) {
      return of(this.cache);
    }

    // 3. Si no, hacemos la petición y guardamos el resultado en caché (tap)
    return this.http.get<Character[]>(this.dataUrl).pipe(
      tap(data => this.cache = data)
    );
  }

  getCharacterById(id: string): Observable<Character | undefined> {
    // Reutilizamos el caché también para buscar detalles
    return this.getCharacters().pipe(
      map(chars => chars.find(c => c.id === id))
    );
  }
}