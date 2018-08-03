import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthorizerService } from './authorizer.service';
import { HandlerService } from '../core/services/handler.service';

@Injectable()
export class AuthorizerGuard implements CanActivate {

  constructor(
    private auth: AuthorizerService,
    private handler: HandlerService,
    private router: Router
  ) { }

  // tem ser declarado no providers do modulo
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Verifica se o token esta valido
    if (this.auth.isAccessTokenInvalid()) {
      this.handler.showDialogWarn('Sessão expirou, efetue novo login');
      this.router.navigate(['/login']);
      return false;
    }

    // Identifica par qual rota esta sendo direcionada
    // recupera as roes da rota definida no AppRouterModule
    // Verfica no metodo hasAnyPermission se o user logado possuia role
    if (next.data.roles && this.auth.hasAnyPermission(next.data.roles)) {
      return true;
    }
    this.handler.showDialogWarn('Acesso não permitido a este modulo');

    return false;
  }
}
