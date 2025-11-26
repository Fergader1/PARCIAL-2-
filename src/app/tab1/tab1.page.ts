import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, IonInfiniteScroll, InfiniteScrollCustomEvent, SearchbarCustomEvent, SegmentCustomEvent } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharactersService } from '../core/services/characters.service';
import { Character } from '../core/interfaces/character';
import { addIcons } from 'ionicons';
import { arrowForwardCircle, search, funnel, searchOutline, filterCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  characters: Character[] = [];
  allFiltered: Character[] = [];
  displayCharacters: Character[] = [];
  
  searchTerm = '';
  sortOrder: 'asc' | 'desc' | 'power' = 'asc';
  
  readonly PAGE_SIZE = 10;
  currentPage = 0;
  
  // NUEVO: Estado de carga
  isLoading = true;

  constructor(
    private charService: CharactersService,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowForwardCircle, search, funnel, searchOutline, filterCircle });
  }

  ngOnInit() {
    this.charService.getCharacters().subscribe(data => {
      this.characters = data;
      this.allFiltered = [...data];
      
      // Simulamos un pequeño retraso para ver la animación de carga (Skeleton)
      // En una app real esto ocurriría naturalmente mientras llegan los datos
      setTimeout(() => {
        this.isLoading = false;
        this.applySortAndFilter();
      }, 1500);
    });
  }

  resetPagination() {
    this.currentPage = 0;
    this.displayCharacters = [];
    this.addMoreItems();
    if (this.infiniteScroll) this.infiniteScroll.disabled = false;
  }

  addMoreItems() {
    const start = this.currentPage * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;
    const nextBatch = this.allFiltered.slice(start, end);
    
    this.displayCharacters = [...this.displayCharacters, ...nextBatch];
    this.currentPage++;
  }

  onIonInfinite(ev: Event) {
    this.addMoreItems();
    const infiniteEvent = ev as InfiniteScrollCustomEvent;
    infiniteEvent.target.complete();
      
    if (this.displayCharacters.length >= this.allFiltered.length) {
      infiniteEvent.target.disabled = true;
    }
  }

  onSearchChange(event: Event) {
    const customEvent = event as SearchbarCustomEvent;
    this.searchTerm = (customEvent.detail.value || '').toLowerCase();
    this.applySortAndFilter();
  }

  filterGroup(event: Event) {
    const customEvent = event as SegmentCustomEvent;
    const val = customEvent.detail.value;
    
    let filtered = this.characters;

    if (val !== 'todos') {
      filtered = filtered.filter(c => c.group === val);
    }
    
    if (this.searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(this.searchTerm) || 
        c.alias.some(a => a.toLowerCase().includes(this.searchTerm))
      );
    }
    
    this.allFiltered = filtered;
    this.applySort();
  }

  applySortAndFilter() {
    let temp = this.characters;
    
    if (this.searchTerm) {
      temp = temp.filter(c => 
        c.name.toLowerCase().includes(this.searchTerm) || 
        c.alias.some(a => a.toLowerCase().includes(this.searchTerm))
      );
    }
    
    this.allFiltered = temp;
    this.applySort();
  }

  async changeSort() {
    let message = '';
    if (this.sortOrder === 'asc') {
      this.sortOrder = 'desc';
      message = 'Orden: Z - A';
    } else if (this.sortOrder === 'desc') {
      this.sortOrder = 'power';
      message = 'Orden: Mayor Poder';
    } else {
      this.sortOrder = 'asc';
      message = 'Orden: A - Z';
    }
    
    this.applySort();

    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      color: 'dark',
      icon: 'filter-circle'
    });
    toast.present();
  }

  applySort() {
    this.allFiltered.sort((a, b) => {
      if (this.sortOrder === 'power') return b.powerStats.total - a.powerStats.total;
      if (this.sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    
    this.resetPagination();
  }
}