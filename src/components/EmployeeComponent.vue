<template>
    <div class="card">
        <h1>Employee Management System</h1>
        <div class="card-container">
            <div class="button-container">
                <Button label="Add Employee" icon="pi pi-plus" @click="openNew" />
            </div>

            <DataTable :value="employees" :paginator="true" :rows="10" dataKey="id" :rowHover="true"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]" responsiveLayout="scroll"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees">
                <Column field="id" header="ID" sortable></Column>
                <Column field="name" header="Name" sortable></Column>
                <Column field="email" header="Email" sortable></Column>
                <Column field="position" header="Position" sortable></Column>
                <Column field="department.name" header="Department" sortable></Column>
                <Column headerStyle="width:8rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
                    <template #body="slotProps">
                        <div class="button-group">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editEmployee(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                                @click="confirmDelete(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="employeeDialog" :style="{ width: '450px' }" header="Employee Details" :modal="true"
                class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="employee.name" required autofocus
                        :class="{ 'p-invalid': submitted && !employee.name }" />
                    <small class="p-error" v-if="submitted && !employee.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model.trim="employee.email" required
                        :class="{ 'p-invalid': submitted && !employee.email }" />
                    <small class="p-error" v-if="submitted && !employee.email">Email is required.</small>
                </div>
                <div class="field">
                    <label for="position">Position</label>
                    <InputText id="position" v-model.trim="employee.position" />
                </div>
                <div class="field">
                    <label for="department">Department</label>
                    <Dropdown id="department" v-model="employee.department" :options="departments" optionLabel="name"
                        placeholder="Select a Department" />
                </div>

                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveEmployee" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deleteEmployeeDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="employee">Are you sure you want to delete <b>{{ employee.name }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEmployeeDialog = false" />
                    <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteEmployee" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

// PrimeVue components
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

const toast = useToast();

// State variables
const employees = ref([]);
const employeeDialog = ref(false);
const deleteEmployeeDialog = ref(false);
const employee = ref({});
const submitted = ref(false);

// Sample departments
const departments = [
    { name: 'Engineering', code: 'ENG' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Finance', code: 'FIN' },
    { name: 'Human Resources', code: 'HR' },
    { name: 'Sales', code: 'SLS' }
];

// Load initial data
onMounted(() => {
    // Load from localStorage if exists, otherwise use sample data
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        employees.value = JSON.parse(storedEmployees);
    } else {
        // Sample employee data
        employees.value = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                position: 'Software Engineer',
                department: departments[0]
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                position: 'Marketing Manager',
                department: departments[1]
            },
            {
                id: 3,
                name: 'Robert Johnson',
                email: 'robert.johnson@example.com',
                position: 'Finance Analyst',
                department: departments[2]
            }
        ];
        // Save to localStorage
        localStorage.setItem('employees', JSON.stringify(employees.value));
    }
});

// Methods
const openNew = () => {
    employee.value = {};
    submitted.value = false;
    employeeDialog.value = true;
};

const hideDialog = () => {
    employeeDialog.value = false;
    submitted.value = false;
};

const saveEmployee = () => {
    submitted.value = true;

    if (employee.value.name && employee.value.email) {
        if (employee.value.id) {
            // Update existing employee
            const index = employees.value.findIndex(e => e.id === employee.value.id);
            employees.value[index] = { ...employee.value };
            toast.add({ severity: 'success', summary: 'Success', detail: 'Employee Updated', life: 3000 });
        } else {
            // Create new employee
            employee.value.id = createId();
            employees.value.push({ ...employee.value });
            toast.add({ severity: 'success', summary: 'Success', detail: 'Employee Created', life: 3000 });
        }

        // Save to localStorage
        localStorage.setItem('employees', JSON.stringify(employees.value));

        employeeDialog.value = false;
        employee.value = {};
    }
};

const editEmployee = (emp) => {
    employee.value = { ...emp };
    employeeDialog.value = true;
};

const confirmDelete = (emp) => {
    employee.value = emp;
    deleteEmployeeDialog.value = true;
};

const deleteEmployee = () => {
    employees.value = employees.value.filter(e => e.id !== employee.value.id);
    deleteEmployeeDialog.value = false;
    employee.value = {};
    toast.add({ severity: 'success', summary: 'Success', detail: 'Employee Deleted', life: 3000 });

    // Save to localStorage
    localStorage.setItem('employees', JSON.stringify(employees.value));
};

const createId = () => {
    let id = 1;
    if (employees.value.length > 0) {
        id = Math.max(...employees.value.map(e => e.id)) + 1;
    }
    return id;
};
</script>

<style scoped>
.card {
    max-width: 920px;
    margin: 0 auto;
    padding: 20px;
}

.card h1 {
    text-align: center;
    margin-bottom: 20px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.mr-2 {
    margin-right: 0.5rem;
}

.confirmation-content {
    display: flex;
    align-items: center;
}
</style>