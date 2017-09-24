import { Router } from '@angular/router';

export class NavigationDelegator {

    private readonly index = ['index'];

    constructor(private router: Router) { }

    public readonly GoHome = () => {
        this.router.navigate(this.index);
    }

}
