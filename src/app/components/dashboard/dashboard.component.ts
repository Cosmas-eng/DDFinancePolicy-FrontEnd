import { Component, OnInit } from '@angular/core';
import { PolicyToTable, StatusOptions } from 'src/app/core/models/index';
import { PolicyDataSourceService, PolicyService } from 'src/app/core/services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'holder', 'status'];
  dataToDisplay: PolicyToTable[] = [];
  dataSource: PolicyDataSourceService;
  searchTerm: string | null = null;
  filterStatus: number | null = null;

  statusOptions = [
    { value: null, viewValue: 'All' },
    { value: StatusOptions.Active, viewValue: 'Active' },
    { value: StatusOptions.Inactive, viewValue: 'Inactive' },
    { value: StatusOptions.Pending, viewValue: 'Pending' },
    { value: StatusOptions.Cancelled, viewValue: 'Cancelled' }
  ];

  constructor(private service: PolicyService, private router: Router) {
    this.dataSource = new PolicyDataSourceService(this.dataToDisplay);
  }

  ngOnInit(): void {
    this.fetchPolicies();
  }

  fetchPolicies(): void {
    this.service.getPolicies(this.searchTerm, this.filterStatus).subscribe(data => { 
      this.dataToDisplay = data.policies; 
      this.dataSource.updateData(this.dataToDisplay); // Update the dataSource with new data
    });
  }

  reloadPolicyData(): void {
    this.fetchPolicies();
  }

  addNewPolicy() {
    this.router.navigate(['/add-policy']);
  }

  loadPolicyDetails(row: PolicyToTable) {
    this.router.navigate(['/policy', row.id]);
  }
}
