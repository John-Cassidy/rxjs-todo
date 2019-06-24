import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-doby-checklist',
  template: `
    <label for="checklist" title="add items as comma separated values">Checklist: </label>
    <input id="checklist" [value]="checklistString" (keyup)="onChecklistChange($event.target.value)">
    <ng-container *ngFor="let item of checklist; index as i">
      <div class="checkbox-wrapper">
        <input type="checkbox" id="{{i + '_' + item.description}}" [checked]="item.completed" (change)="onToggleChecklistItem(i)"/>
      </div>
      <label for="{{i + '_' + item.description"> {{item.description}}</label>
    </ng-container>
  `,
  styleUrls: ['doby-checklist.component.css']
})
export class DobyChecklistComponent implements OnInit, OnDestroy {
  @Input() checklist: {description: string, completed?: boolean}[];
  @Output() checklistChange = new EventEmitter<{description: string, completed?: boolean}[]>();
  checklistSub: Subscription;

  checklistStream = new Subject<string>();

  ngOnInit() {
    this.checklistSub = this.checklistStream.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => value && value.length > 0),
      map((value: string) => {
        return value.split(',')
          .filter(v => v && v.trim())
          .map((v, i) => {
            let completed;
            if (this.checklist && this.checklist.length > i) {
              completed = this.checklist[i].completed;
            }
            return {description: v.trim(), completed};
          });
      })
    ).subscribe(checklist => this.checklistChange.emit(checklist));
  }

  ngOnDestroy() {
    if (this.checklistSub) { this.checklistSub.unsubscribe(); }
  }

  onChecklistChange(tags: string) {
    this.checklistStream.next(tags);
  }

  get checklistString(): string {
    return this.checklist && this.checklist.length && this.checklist.map(c => c.description).join(', ');
  }

  onToggleChecklistItem(index: number) {
    const checklist = [...this.checklist];
    if (checklist.length > index) {
      checklist[index].completed = !checklist[index].completed;
      this.checklistChange.emit(checklist);
    }
  }
}
