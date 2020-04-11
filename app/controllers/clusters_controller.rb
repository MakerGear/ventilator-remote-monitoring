class ClustersController < ApplicationController
  before_action :require_admin_or_org_admin
  before_action :set_cluster, only: [:show, :edit, :update, :destroy]


  # GET /clusters
  # GET /clusters.json
  def index
    p current_user.organization
    if current_user.organization.present?
      @clusters = current_user.organization.clusters
    else
      @clusters = nil
    end
  end

  # GET /clusters/1
  # GET /clusters/1.json
  def show
  end

  # GET /clusters/new
  def new
    @cluster = Cluster.new
    if(params[:organization_id])
      if current_user.admin? || (current_user.org_admin? && current_user.organization.id == params[:organization_id])
        @cluster.organization_id = params[:organization_id]
      end
    end
  end

  # GET /clusters/1/edit
  def edit
  end

  # POST /clusters
  # POST /clusters.json
  def create
    @cluster = Cluster.new(cluster_params)

    # non-admin users are only allowed to create clusters in thier own organization
    unless current_user.admin?
      @cluster.organization_id = current_user.organization.id
    end

    respond_to do |format|
      if @cluster.save
        format.html { redirect_to organization_path(@cluster.organization_id), notice: 'Cluster was successfully created.' }
        format.json { render :show, status: :created, location: @cluster }
      else
        format.html { render :new }
        format.json { render json: @cluster.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /clusters/1
  # PATCH/PUT /clusters/1.json
  def update
    # non-admin users are only allowed to create clusters in thier own organization
    unless current_user.admin?
      @cluster.organization_id = current_user.organization.id
    end

    respond_to do |format|
      if @cluster.update(cluster_params)
        format.html { redirect_to @cluster, notice: 'Cluster was successfully updated.' }
        format.json { render :show, status: :ok, location: @cluster }
      else
        format.html { render :edit }
        format.json { render json: @cluster.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /clusters/1
  # DELETE /clusters/1.json
  def destroy
    @cluster.destroy
    respond_to do |format|
      format.html { redirect_to clusters_url, notice: 'Cluster was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_cluster
      # Allow the current request if the user is an admin or if the cluster belongs to the users' organization
      @cluster = Cluster.find(params[:id])
      if current_user.admin? || (current_user.organization && (current_user.organization.id == @cluster.organization.id))
        # ok
      else
        flash[:error] = "You do not have permission to view this cluster"
        redirect_to clusters_url
      end
    end

    # Only allow a list of trusted parameters through.
    def cluster_params
      params.require(:cluster).permit(:name, :description, :organization_id)
    end
end
