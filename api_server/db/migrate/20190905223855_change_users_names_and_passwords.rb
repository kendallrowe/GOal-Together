class ChangeUsersNamesAndPasswords < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :name, :first_name
    rename_column :users, :password, :password_digest
    add_column :users, :last_name, :string
  end
end
