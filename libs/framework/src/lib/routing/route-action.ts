export class RouteAction {
  public static parse(
    uri: string,
    action: Record<string | 'uses', unknown> | []
  ) {
    if (action === null) {
      return this.missingAction(uri);
    }

    if (typeof action === 'function') {
      return {
        uses: action,
      };
    } else if (Array.isArray(action)) {
      return {
        uses: this.findFunction(action),
      };
    }

    return action;
  }

  protected static missingAction(uri: string) {
    return {
      uses: () => {
        throw new Error(`Route for [$uri] has no action.`);
      },
    };
  }

  protected static findFunction(action: []) {
    action.find((value, key) => {
      return typeof value === 'function' && typeof key === 'number';
    });
  }
}
