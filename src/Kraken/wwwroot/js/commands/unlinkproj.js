﻿define(['cmdr', 'bus', 'services/releaseBatches'], function (cmdr, bus, releaseBatchesService) {

    return new cmdr.Definition({
        name: 'UNLINKPROJ',
        description: 'Unlinks an Octopus project from a release batch.',
        usage: 'UNLINKPROJ batchId projectIdOrSlugOrName\n\nProject id can be full (Projects-123) or short (123)',
        main: function (batchId, projectIdOrSlugOrName) {
            if (!batchId || !projectIdOrSlugOrName) {
                this.shell.writeLine('Batch id and project id or slug or name required', 'error');
                return;
            }
            return releaseBatchesService.unlinkProject(batchId, projectIdOrSlugOrName).then(function () {
                bus.publish('releasebatches:update', batchId);
                this.shell.writeLine('Release batch updated', 'success');
            }.bind(this)).fail(function (xhr, error, message) {
                this.shell.writeLine(message, 'error');
                if (xhr.responseText) {
                    this.shell.writeLine(xhr.responseText, 'error');
                }
                this.shell.writeLine('Operation Failed', 'error');
            }.bind(this));
        }
    });

});