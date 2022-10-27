import { Access, DictValues, ExpandRecursively, StringKeysOf } from '@samhuk/type-helpers'

export type PermissionsOptions = {
  $description?: string
} & {
  [TChildPermissionOptionsName in string]: PermissionsOptions
}

export type RootPermission = {
  id: number
  uuid: string
  name: 'root'
  description: 'root permission with global access'
  path: 'root'
}

export type Permission<
  TName extends string = string,
  TParentPath extends string = string,
  TDescription extends string = string,
> = {
  id: number
  uuid: string
  parentId?: number
  name: TName
  description?: TDescription
  path: `${TParentPath}/${TName}`
}

export type PermissionsNode<
  TPermissionsOptions extends PermissionsOptions = PermissionsOptions,
  TName extends string = string,
  TParentPath extends string = string,
> = {
  $this: Permission<
    TName,
    TParentPath,
    TPermissionsOptions extends { $description: string } ? TPermissionsOptions['$description'] : string
  >
}

export type Permissions<
  TPermissionsOptions extends PermissionsOptions = PermissionsOptions,
  TName extends string = string,
  TParentPath extends string = string,
> = PermissionsNode<TPermissionsOptions, TName, TParentPath>
  & { [TChildPermissionOptionsName in Exclude<StringKeysOf<TPermissionsOptions>, '$description'>]:
    Permissions<TPermissionsOptions[TChildPermissionOptionsName], TChildPermissionOptionsName, `${TParentPath}/${TName}`>
  }

export type RootPermissions<
  TPermissionsOptions extends PermissionsOptions = PermissionsOptions,
> = Permissions<TPermissionsOptions, 'root', ''>

type _ExtractAllPaths<TPermissions extends Permissions> = TPermissions['$this']['path']
  | DictValues<{ [TChildName in Exclude<StringKeysOf<TPermissions>, '$this'>]: _ExtractAllPaths<Access<TPermissions, TChildName>> }>

type ExtractAllPaths<TPermissions extends Permissions> = ExpandRecursively<_ExtractAllPaths<TPermissions>>

export type PermissionDict = { [permissionId: number]: Permission }

export type PermissionInfo<TPermissionsOptions extends PermissionsOptions = PermissionsOptions> = {
  permissions: RootPermissions<TPermissionsOptions>
  permissionList: Permission[]
  permissionDict: PermissionDict
  permissionPaths: ExtractAllPaths<RootPermissions<TPermissionsOptions>>
}

export type PermissionSelector<TPermissions extends Permissions> = (p: TPermissions) => Permissions
