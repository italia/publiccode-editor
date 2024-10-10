{
  description = "A web editor to generate and validate `publiccode.yml` files";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { flake-utils, nixpkgs, self }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; }; in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.go
            pkgs.nodejs
            pkgs.shellcheck
          ];
        };
        formatter = pkgs.nixpkgs-fmt;
      }
    );
}
